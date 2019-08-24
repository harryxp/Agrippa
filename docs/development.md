Environment setup
=================

1. Install PureScript stuff - purescript, pulp, bower.  Pulp might need npm.
2. Install Haskell stuff (Stack).

Development
===========

Client
------

1. Note that though PureScript packages in bower.json have fixed versions, they
   only work with certain versions of the PureScript compiler - 0.12.* as of now.

2. Dependencies are in `bower.json`.

        $ cd client/
        $ bower update

3. Some useful commands during development (to see more try `pulp`):

        $ pulp browserify -O --main Agrippa.Main --to web/agrippa.js    # generate

        $ pulp build            # type check
        $ pulp psci             # or `pulp repl`
        > import Agrippa.Main

4. Haskell's `undefined` can be mimiced by `unsafeCoerce unit`.

        import Unsafe.Coerce (unsafeCoerce)

See [Differences from
Haskell](https://github.com/purescript/documentation/blob/master/language/Differences-from-Haskell.md).
There's also a purescript-undefined package but I've never tried it.

Server
------

1. Dependencies are in `agrippa-server.cabal`.

2. Some useful commands during development (to see more try `stack`):

        $ cd server/
        $ stack build
        $ stack ghci
        $ stack exec agrippad -- ../client/     # run the server and use ../client/ as server root

Release
=======

Tag the commit
--------------

        $ git tag -a v<version> -m 'Version <version>'
        $ git push --tags

If you made a mistake

        $ git tag --delete v<version>
        $ git push --delete origin v<version>

Linux and Mac
-------------

        $ ./dist.pl <version> <os>  # run it under the project directory

Windows
-------

The current process is that we build the server binary on Windows but build the
client on a Unix-like system, and also create the archive there.

1. Install [Cmder](http://cmder.net/) and
   [Stack](https://www.haskellstack.org/) on Windows.
2. Build `agrippad.exe` on Windows, copy it to Linux or Mac, and put it under
   the project directory.
3. Then run on Mac or Linux: `./dist.pl <version> Windows`.

TODO
====

General
-------

- Config validation.
- A delayed async output could wipe out what a user expects to see.
- https
- Better documentation - document each plugin, hotkey setup.
- Installation utility?
- Better error handling
    - Backend: readFile catch exception?
- Formatted string instead of <> (Text.Formatting?)
- Learn Except

TaskSearch plugin
-----------------

- Add more tips, espectially for activation.

KeePass plugin
--------------

- A bunch of TODOs in the code
- Encrypt password in memory?
- Handle wrong master key case
- Master key file?
- Decrypt only once?
- Shortcuts

Clock plugin
------------

- Support different time zones

Calculator plugin
-----------------

- Support power.  See purescript-math's Math.pow
- `fix`

File System plugins
-------------------

- Still slow on the backend side - arrays in IndexBuilder?  trie?
- It does not detect new items automatically.
- Frontend max recursion level exceeded if too many items.
- Highlight keyword.
- On Linux when a child process is not reaped, it becomes a zombie after
  termination. On Mac this is not a problem because `open` handles it properly.

Online Search plugin
--------------------

- Query using a template library?  Text.Formatting?
- Only one query parameter is allowed now
- Allow sending one query to multiple websites?
