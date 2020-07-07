module Agrippa.Plugins.KeePass1 (registerHandlers) where

-- Reference implementations:
-- 1. KeePass-1.35-Src/KeePassLibCpp/Details/PwFileImpl.cpp
-- 2. https://searchcode.com/codesearch/view/19368318/ (source downloadable at https://www.keepassx.org/downloads/0-4)

import Control.Exception (Exception, throw, try)
import Data.Aeson (Object, ToJSON(toJSON), Value(Null, Object, String))
import Data.Bits (shiftL, (.&.))
import Data.IORef (IORef, readIORef, writeIORef)
import Data.String (fromString)
import Data.Word (Word16, Word32, Word8)
import Web.Scotty (ActionM, RoutePattern, ScottyM, json, jsonData, liftAndCatchIO, post)

import qualified Crypto.Cipher.AES         as A (decryptCBC, encryptECB, initAES)
import qualified Crypto.Hash.SHA256        as H (hash)
import qualified Data.ByteString           as B (ByteString, append, drop, head, last, length, readFile, take)
import qualified Data.ByteString.UTF8      as U (toString)
import qualified Data.HashMap.Strict       as M (HashMap, elems, empty, insert)
import qualified Data.Text                 as T (Text, dropWhileEnd, isInfixOf, null, pack, toLower)

import Agrippa.Utils (lookupJSON)

registerHandlers :: Object -> RoutePattern -> RoutePattern -> IORef (Maybe String) -> ScottyM ()
registerHandlers agrippaConfig suggestUrl unlockUrl passwordBox = do
  post suggestUrl $ do
    password <- liftAndCatchIO (readIORef passwordBox)
    params   <- jsonData :: ActionM Object
    let maybeEntriesActionM = do
          tasks    <- lookupJSON "tasks" agrippaConfig :: Maybe Object
          task     <- case (filter usesKeePass1Plugin . M.elems) tasks of
            [t] -> Just t  -- TODO what about multiple KeePass1 tasks?
            _   -> Nothing
          filePath <- case task of
            Object o -> lookupJSON "databaseFilePath" o :: Maybe String
            _        -> Nothing
          pwd      <- password
          term     <- lookupJSON "term" params
          Just (liftAndCatchIO (getKeePass1Entries filePath pwd term))
    maybe (json Null) (>>= json) maybeEntriesActionM

  post unlockUrl $ do
    params   <- jsonData :: ActionM Object
    case lookupJSON "password" params :: Maybe String of
      Just password -> liftAndCatchIO (writeIORef passwordBox (Just password)) >> json ("OK" :: String)
      Nothing       -> json ("Incorrect parameter." :: String)

usesKeePass1Plugin :: Value -> Bool
usesKeePass1Plugin (Object o) = maybe False (== "KeePass1") (lookupJSON "plugin" o :: Maybe String)
usesKeePass1Plugin _          = False

getKeePass1Entries :: String -> String -> String -> IO (Maybe [Entry])
getKeePass1Entries filePath password term = do
   eitherGroupsAndEntries <- try $ readKeePass1File filePath password :: IO (Either DecryptionException ([Group], [Entry]))
   case eitherGroupsAndEntries of
     Left  _                 -> return Nothing
     Right (groups, entries) -> return $ Just $ findItems (keepNonBackupEntries groups entries) term

keepNonBackupEntries :: [Group] -> [Entry] -> [Entry]
keepNonBackupEntries groups entries =
  let backupGroups = filter isBackupGroup groups
      backupGroupIds = concatMap (\(Group fields) -> extractGroupId fields) backupGroups
  in case backupGroupIds of
      [backupGroupId] -> filter (isNotBackup backupGroupId) entries
      _               -> entries
  where isBackupGroup (Group fields) = any (== (GroupTitle "Backup\0")) fields
        extractGroupId (GroupId i:_ ) = [i]
        extractGroupId (        _:xs) = extractGroupId xs
        extractGroupId []             = []
        isNotBackup backupGroupId (Entry fields) = not (any (== (EntryGroupId backupGroupId)) fields)

findItems :: [Entry] -> String -> [Entry]
findItems entries ""   = entries
findItems entries term = filter (\(Entry fields) -> any termMatchesEntryField fields) entries
  where termMatchesEntryField :: EntryField -> Bool
        termMatchesEntryField (EntryTitle title) = T.isInfixOf ((T.toLower . T.pack) term) (T.toLower title)
        termMatchesEntryField _                  = False

-- TODO make below a library

data DecryptionException = DecryptionException
  deriving (Show)

instance Exception DecryptionException

headerSize      :: Int
headerSize       = 124
pwmDbsig1       :: Int
pwmDbsig1        = 0x9AA2D903
pwmDbsig2       :: Int
pwmDbsig2        = 0xB54BFB65
pwmDbverDw      :: Int
pwmDbverDw       = 0x00030002
pwmFlagRijndael :: Int
pwmFlagRijndael  = 2
pwmFlagArcfour  :: Int
pwmFlagArcfour   = 4
pwmFlagTwofish  :: Int
pwmFlagTwofish   = 8

readKeePass1File :: String -> String -> IO ([Group], [Entry])
readKeePass1File filePath pwd = do
  contents <- loadFile filePath
  let hdr = parseHeader contents
  validateSignatures hdr
  validateVersion hdr
  validateNumGroups hdr
  let algorithm = selectAlgorithm hdr
      finalKey = getFinalKey (fromString pwd) hdr
      maybeDecryptedBuf = decrypt contents hdr algorithm finalKey
  case maybeDecryptedBuf of
    Just decryptedBuf ->
      let (groups, offsetAfterGroups) = parseGroups decryptedBuf (numGroups hdr)
          (entries, _) = parseEntries decryptedBuf (numEntries hdr) offsetAfterGroups
      in return (groups, entries)
    Nothing -> throw DecryptionException

-- TODO file not found
loadFile :: String -> IO B.ByteString
loadFile filePath = do
  contents <- B.readFile filePath
  if B.length contents < headerSize
    then error "Error: file size < header size."
    else return contents

data Header = Header { signature1       :: Int
                     , signature2       :: Int
                     , flags            :: Int
                     , version          :: Int
                     , finalRandomSeed  :: B.ByteString
                     , encryptionIV     :: B.ByteString
                     , numGroups        :: Int
                     , numEntries       :: Int
                     , contentsHash     :: B.ByteString
                     , transfRandomSeed :: B.ByteString
                     , keyTransfRounds  :: Int
                     }

parseHeader :: B.ByteString -> Header
parseHeader buf = Header { signature1       = (littleEndian32ToInt . substring   0  4) buf
                         , signature2       = (littleEndian32ToInt . substring   4  4) buf
                         , flags            = (littleEndian32ToInt . substring   8  4) buf
                         , version          = (littleEndian32ToInt . substring  12  4) buf
                         , finalRandomSeed  = (                      substring  16 16) buf
                         , encryptionIV     = (                      substring  32 16) buf
                         , numGroups        = (littleEndian32ToInt . substring  48  4) buf
                         , numEntries       = (littleEndian32ToInt . substring  52  4) buf
                         , contentsHash     = (                      substring  56 32) buf
                         , transfRandomSeed = (                      substring  88 32) buf
                         , keyTransfRounds  = (littleEndian32ToInt . substring 120  4) buf
                         }

validateSignatures :: Header -> IO ()
validateSignatures hdr =
  if ((signature1 hdr) == pwmDbsig1) && ((signature2 hdr) == pwmDbsig2)
    then return ()
    else error "Error: wrong signature."

{- The reference implementation KeePass 1.35 also supports older version 0.1.x
 - and 0.2.x databases (implemented in OpenDatabaseV1 and OpenDatabaseV2).
 - This can be detected by the version field in header.
 -
 - We don't deal with older versions.
 -}

validateVersion :: Header -> IO ()
validateVersion hdr =
  if (version hdr) .&. 0xFFFFFF00 == pwmDbverDw .&. 0xFFFFFF00
    then return ()
    else error "Error: unsupported version."

validateNumGroups :: Header -> IO ()
validateNumGroups hdr = if numGroups hdr > 0 then return () else error "Error: illegal number of groups."

data KeePass1Cipher = RijndaelCipher | TwofishCipher

selectAlgorithm :: Header -> KeePass1Cipher
selectAlgorithm hdr | (flags hdr) .&. pwmFlagRijndael /= 0 = RijndaelCipher
                    | (flags hdr) .&. pwmFlagTwofish  /= 0 = TwofishCipher
                    | otherwise                            = error "Error: unknown encryption algorithm."

getFinalKey :: B.ByteString -> Header -> B.ByteString
getFinalKey pwd hdr =
  let rawMasterKey = H.hash pwd
      masterKey = transformKey rawMasterKey
  in H.hash (B.append (finalRandomSeed hdr) masterKey)
  where
    transformKey :: B.ByteString -> B.ByteString
    transformKey rawMasterKey =
      let aes = A.initAES (transfRandomSeed hdr)
          rawMasterKey' = iterate (A.encryptECB aes) rawMasterKey !! keyTransfRounds hdr
      in H.hash rawMasterKey'

decrypt :: B.ByteString -> Header -> KeePass1Cipher -> B.ByteString -> Maybe B.ByteString
decrypt buffer hdr algorithm finalKey =
  let totalSize = B.length buffer in
    case algorithm of
      RijndaelCipher -> let decryptedBuf = A.decryptCBC
                                            (A.initAES finalKey)
                                            (encryptionIV hdr)
                                            (B.drop headerSize buffer)
                            cryptoSize = totalSize - fromIntegral (B.last decryptedBuf) - headerSize
                        in if validateCryptoSize cryptoSize && validateContentsHash cryptoSize decryptedBuf
                              then Just decryptedBuf
                              else Nothing
      TwofishCipher  -> undefined -- TODO
  where
    validateCryptoSize cryptoSize = cryptoSize <= 2147483446 && not (cryptoSize == 0 && (numGroups hdr) > 0)
    validateContentsHash cryptoSize decryptedBuf = (contentsHash hdr) == H.hash (B.take cryptoSize decryptedBuf)

data Group = Group [GroupField] deriving Show
data GroupField = GroupId    Int
                | GroupTitle T.Text
                | GroupImage Int
                | GroupLevel Int
                | GroupEnd
                deriving (Eq, Show)

-- TODO State Monad
parseGroups :: B.ByteString -> Int -> ([Group], Int)
parseGroups decryptedBuf numGroups' = (head . drop numGroups' . iterate parseGroup) ([], 0)
  where
    parseGroup :: ([Group], Int) -> ([Group], Int)
    parseGroup (groups, offset) =
      let (groupFields, newOffset) =
            until
              (\(groupFields', _) -> not (null groupFields') && head groupFields' == GroupEnd)
              parseGroupField
              ([], offset)
      in (Group groupFields : groups, newOffset)
    parseGroupField :: ([GroupField], Int) -> ([GroupField], Int)
    parseGroupField (groupFields, offset) =
      let fieldType = (littleEndian16ToInt . substring offset     2) decryptedBuf
          fieldSize = (littleEndian32ToInt . substring (offset+2) 4) decryptedBuf
          -- TODO handling out of range
          offset'   = offset + 6
          newOffset = offset' + fieldSize
      in case fieldType of
        0x0001 -> (((GroupId    . littleEndian32ToInt . substring offset' 4        ) decryptedBuf) : groupFields, newOffset)
        0x0002 -> (((GroupTitle . T.pack . U.toString . substring offset' fieldSize) decryptedBuf) : groupFields, newOffset)
        0x0007 -> (((GroupImage . littleEndian32ToInt . substring offset' 4        ) decryptedBuf) : groupFields, newOffset)
        0x0008 -> (((GroupLevel . littleEndian16ToInt . substring offset' 2        ) decryptedBuf) : groupFields, newOffset)
        0xFFFF -> (  GroupEnd                                                                      : groupFields, newOffset)
        _      -> (groupFields, newOffset)
        {- The last case includes:
         - 0x0000 (ignore)
         - 0x0003, 0x0004, 0x0005, 0x0006, 0x0009 (no longer used by KeePassX but part of the KDB format)
         - other unsupported fields
        -}

data Entry = Entry [EntryField] deriving Show

instance ToJSON Entry where
  toJSON (Entry fields) = (Object . foldr keepFieldsOfInterest M.empty) fields

keepFieldsOfInterest :: EntryField -> M.HashMap T.Text Value -> M.HashMap T.Text Value
keepFieldsOfInterest (EntryTitle    title)    accum = keepFieldsOfInterest' "Title"    title    accum
keepFieldsOfInterest (EntryURL      url)      accum = keepFieldsOfInterest' "URL"      url      accum
keepFieldsOfInterest (EntryUserName userName) accum = keepFieldsOfInterest' "UserName" userName accum
keepFieldsOfInterest (EntryPassword password) accum = keepFieldsOfInterest' "Password" password accum
keepFieldsOfInterest (EntryComment  comment)  accum = keepFieldsOfInterest' "Comment"  comment  accum
keepFieldsOfInterest _                        accum = accum

keepFieldsOfInterest' :: T.Text -> T.Text -> M.HashMap T.Text Value -> M.HashMap T.Text Value
keepFieldsOfInterest' key value accum =
  let chompedValue = T.dropWhileEnd (== '\0') value
  in if T.null chompedValue then accum else M.insert key (String chompedValue) accum

data EntryField = EntryUUID             B.ByteString
                | EntryGroupId          Int
                | EntryImage            Int
                | EntryTitle            T.Text
                | EntryURL              T.Text
                | EntryUserName         T.Text
                | EntryPassword         T.Text
                | EntryComment          T.Text
                | EntryCreationDate     B.ByteString
                | EntryLastModifiedDate B.ByteString
                | EntryLastAccessedDate B.ByteString
                | EntryExpirationDate   B.ByteString
                | EntryDesc             T.Text
                | EntryEnd
                deriving (Eq, Show)

parseEntries :: B.ByteString -> Int -> Int -> ([Entry], Int)
parseEntries decryptedBuf numEntries' offset = (head . drop numEntries' . iterate parseEntry) ([], offset)
  where
    parseEntry :: ([Entry], Int) -> ([Entry], Int)
    parseEntry (entries, offset') =
      let (entryFields, newOffset) =
            until
              (\(entryFields', _) -> not (null entryFields') && head entryFields' == EntryEnd)
              parseEntryField
              ([], offset')
      in (Entry entryFields : entries, newOffset)
    parseEntryField :: ([EntryField], Int) -> ([EntryField], Int)
    parseEntryField (entryFields, offset') =
      let fieldType = (littleEndian16ToInt . substring offset'     2) decryptedBuf
          fieldSize = (littleEndian32ToInt . substring (offset'+2) 4) decryptedBuf
          -- TODO handling out of range
          offset''   = offset' + 6
          newOffset  = offset'' + fieldSize
      in case fieldType of
        0x0001 -> (((EntryUUID             .                       substring offset'' 16       ) decryptedBuf) : entryFields, newOffset)
        0x0002 -> (((EntryGroupId          . littleEndian32ToInt . substring offset''  4       ) decryptedBuf) : entryFields, newOffset)
        0x0003 -> (((EntryImage            . littleEndian32ToInt . substring offset''  4       ) decryptedBuf) : entryFields, newOffset)
        0x0004 -> (((EntryTitle            . T.pack . U.toString . substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x0005 -> (((EntryURL              . T.pack . U.toString . substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x0006 -> (((EntryUserName         . T.pack . U.toString . substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x0007 -> (((EntryPassword         . T.pack . U.toString . substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x0008 -> (((EntryComment          . T.pack . U.toString . substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x0009 -> (((EntryCreationDate     .                       substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x000A -> (((EntryLastModifiedDate .                       substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x000B -> (((EntryLastAccessedDate .                       substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x000C -> (((EntryExpirationDate   .                       substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0x000D -> (((EntryDesc             . T.pack . U.toString . substring offset'' fieldSize) decryptedBuf) : entryFields, newOffset)
        0xFFFF -> (  EntryEnd                                                                                  : entryFields, newOffset)
        _      -> (entryFields, newOffset)
        {- The last case includes:
         - 0x0000 (ignore)
         - 0x000E (TODO)
         - other unsupported fields
        -}

littleEndian32ToInt :: B.ByteString -> Int
littleEndian32ToInt bytes =
  fromIntegral ( (toInteger .                  word8ToWord32 . B.head)            bytes
               + (toInteger . flip shiftL  8 . word8ToWord32 . B.head . B.drop 1) bytes
               + (toInteger . flip shiftL 16 . word8ToWord32 . B.head . B.drop 2) bytes
               + (toInteger . flip shiftL 24 . word8ToWord32 . B.head . B.drop 3) bytes
               )
  where word8ToWord32 :: Word8 -> Word32
        word8ToWord32 = fromIntegral

littleEndian16ToInt :: B.ByteString -> Int
littleEndian16ToInt bytes =
  fromIntegral ( (toInteger .                  word8ToWord16 . B.head)            bytes
               + (toInteger . flip shiftL  8 . word8ToWord16 . B.head . B.drop 1) bytes
               )
  where word8ToWord16 :: Word8 -> Word16
        word8ToWord16 = fromIntegral

substring :: Int -> Int -> B.ByteString -> B.ByteString
substring offset size = B.take size . B.drop offset
