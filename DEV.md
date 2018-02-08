# Environment setup

1. Install PureScript stuff (purescript, pulp, bower).
2. Install Haskell stuff (Stack).

# Development

## Client

1. Dependencies are in `bower.json`.

        $ cd client/
        $ bower update

2. Some useful commands during development (to see more try `pulp`):

        $ pulp browserify -O --main Agrippa.Main --to web/js/agrippa.js # generate

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

        $ ./dist.sh     # under top-level directory
        $ mv dist/ Agrippa-<version>.<os>
        $ tar -czf Agrippa-<version>.<os>.tar.gz Agrippa-<version>.<os>

## Windows

Same as above but need to replace the binary `agrippad`, and use .zip.

The easiest workflow seems to be:

1. Install [Cmder](http://cmder.net/) and [Stack](https://www.haskellstack.org/).
2. Build `agrippad.exe` and copy it to Linux.
3. Then

        $ mv Agrippa-<version>.Linux/ Agrippa-<version>.Windows/
        $ rm Agrippa-<version>.Windows/agrippad
        $ mv <some-path>/agrippad.exe Agrippa-<version>.Windows/
        $ zip -r Agrippa-<version>.Windows.zip Agrippa-<version>.Windows/

# TODO

## General

- Release
- keepass plugin
- mortgage plugin
- list plugin?
- Build a button to refresh file system indices manually, or use libevent etc.
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

- Still slow on the backend side
- Frontend max recursion level exceeded if too many items
- Highlight keyword

## Online Search plugin

- Query using a template library?  Text.Formatting?
- Only one query parameter is allowed now

