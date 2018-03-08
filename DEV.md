# Environment setup

1. Install PureScript stuff (purescript, pulp, bower).
2. Install Haskell stuff (Stack).

# Development

## Client

1. Dependencies are in `bower.json`.

        $ cd client/
        $ bower update

2. Some useful commands during development (to see more try `pulp`):

        $ pulp browserify -O --main Agrippa.Main --to web/agrippa.js    # generate

        $ pulp build            # type check
        $ pulp psci             # or `pulp repl`
        > import Agrippa.Main

3. Haskell's `undefined` can be mimiced by `unsafeCoerce unit`.

        import Unsafe.Coerce (unsafeCoerce)

See [Differences from Haskell](https://github.com/purescript/documentation/blob/master/language/Differences-from-Haskell.md).

## Server

1. Dependencies are in `agrippa-server.cabal`.

2. Some useful commands during development (to see more try `stack`):

        $ stack build
        $ stack ghci
        $ stack exec agrippad   # run the server

# Release

## Linux and Mac

        $ ./dist.pl <version> <os>  # run it under the project directory

## Windows

The current process is that we build the server binary on Windows but build the
client on a Unix-like system, and also create the archive there.

1. Install [Cmder](http://cmder.net/) and
   [Stack](https://www.haskellstack.org/) on Windows.
2. Build `agrippad.exe` on Windows, copy it to Linux or Mac, and put it under
   the project directory.
3. Then run on Mac or Linux: `./dist.pl <version> Windows`.

# TODO

## General

- keepass plugin: a bunch of TODOs in the code; encrypt password in memory?
- makeAff instead of runAff?
- Backend: readFile catch exception
- Top level suggestion
- Check runAff response status code
- Error handler for runAff
- Formatted string instead of <> (Text.Formatting?)
- Learn Except

## Calculator plugin

- Support power.  See purescript-math's Math.pow
- `fix`

## File System plugins

- Support Windows.
- Still slow on the backend side - arrays in IndexBuilder?  trie?
- It does not detect new items automatically.
- Frontend max recursion level exceeded if too many items.
- Highlight keyword.

## Online Search plugin

- Query using a template library?  Text.Formatting?
- Only one query parameter is allowed now
- Allow sending one query to multiple websites?

