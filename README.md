[Agrippa](https://github.com/harryxp/Agrippa) is a quick-access tool that helps
a user perform various *task*s.

The typical way to use this software is that the user presses a global hotkey
to open the Agrippa Web UI (by default http://localhost:3000), then types a
*keyword* followed by a space, to choose a *task*.  Some tasks work without any
futher interaction while others need the user to provide further input by
continueing to type and/or press enter.  Agrippa guides the user along the way.

*Task*s are configured in
[`config.yaml`](https://github.com/harryxp/Agrippa/blob/master/config.template.linux.yaml)
and their features are implemented by
[*plugin*s](https://github.com/harryxp/Agrippa/tree/master/client/src/Agrippa/Plugins).

Existing plugins and their features:

- Clock
- KeePass1: search KeePass 1.x databases.
- MortgageCalc: compute your monthly payment and amortization.
- OnlineSearch: quick-access to websites and web searches.
- Snippets: search \& recall pieces of text.
- TaskSearch: search currently configured tasks by task names

Installation
============

1. Grab the latest [release](https://github.com/harryxp/Agrippa/releases) for
   your operating system.
2. Unzip it to the location of your choice - let's call it `<installation path>`.
3. Create the directory that holds the configuration file of Agrippa:

- Linux or Mac

        $ mkdir ~/.agrippa.d/

- Windows: create directory `%APPDATA%/agrippa.d/` (typically
  `C:\Users\<user>\AppData\Roaming\agrippa.d`).

4. Copy `<installation path>/config.template.<your OS>.yaml` to the directory
   in step 3.  Rename it to `config.yaml`.
5. Customize your `config.yaml`.
6. Run Agrippa Server:

- Linux or Mac

        $ cd <installation path>
        $ ./agrippad

- Windows: go to `<installation path>` and run `agrippad.exe`.

Usage
=====

While `agrippad` is running, visit its web interface at
[http://localhost:3000/agrippa/](http://localhost:3000/agrippa/).

This address is also configurable in `config.yaml`.

1. Please choose a task by typing a keyword, followed by a space.
2. Or, when a keyword is absent, the default task configured in `config.yaml`
   is chosen.
3. As you type, follow the prompts Agrippa provides.

Global Hotkey
=============

Agrippa is designed to be used with a global hotkey.  The following software is
used by the author to set that up.

- Linux: [XBindKeys](http://www.nongnu.org/xbindkeys/)
- Mac: [skhd](https://github.com/koekeishiya/skhd), [Karabiner-Elements](https://pqrs.org/osx/karabiner/) or [BetterTouchTool](https://www.boastr.net/)
- Windows: [AutoHotKey](https://autohotkey.com/)

History
=======

I love productivity tools like [Alfred](https://www.alfredapp.com/) and
[Butler](https://manytricks.com/butler/), but I can't find one that

1. works across multiple operating systems;
2. offers no-fuss installation; and
3. can be configuraed with a simple file.

Therefore I created Agrippa.

It is named after [Marcus Vipsanius
Agrippa](https://en.wikipedia.org/wiki/Marcus_Vipsanius_Agrippa), right-hand
man of [Augustus](https://en.wikipedia.org/wiki/Augustus), *Princeps Civitatis*
of ancient Rome.
