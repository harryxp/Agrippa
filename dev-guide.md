# Environment setup

1. Install PureScript stuff (purescript, pulp, bower)
2. Install Haskell stuff (stack)

# Development

## Client

1. Dependencies are in `bower.json`.

    $ cd client/
    $ bower update

2. Some useful commands during development (to see more try `pulp`):

    $ pulp browserify -O --main Agrippa.Main --to web/js/scripts.js # generate

    $ pulp build            # type check
    $ pulp psci             # or `pulp repl`
    > import Agrippa.Main

3. Haskell's `undefined` can be mimiced by `unsafeCoerce unit`.

    import Unsafe.Coerce (unsafeCoerce)

## Server

1. Dependencies are in agrippa-server.cabal.

2. Some useful commands during development (to see more try `stack`):

    $ stack build
    $ stack ghci
    $ stack exec agrippad   # run the server

# TODOs

## General

- limit size of output (backend?)
- Backend: readFile catch exception
- Snippets
- TODO list
- Top level suggestion
- Check runAff response status code
- error handler for runAff
- Do not look up config repeatedly
- Formatted string instead of <> (Text.Formatting?)
- Learn Except

## Calculator plugin

- Support power.  See purescript-math's Math.pow
- `fix`

## File System plugins

- highlight keyword
- 500 internal errors
- Quick successive inputs should be merged (maybe use a timer, or just use cache)

## Mac App search plugin

- Pref panes (multiple extensions)

## Online Search plugin

- query using a template library?  Text.Formatting?
- only one query parameter is allowed now

