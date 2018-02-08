[Agrippa](https://github.com/harryxp/Agrippa) is a keyboard-driven web
application that helps the user perform various *task*s.

*Task*s are configured in config.json and their features are implemented by
[*plugin*s](https://github.com/harryxp/Agrippa/tree/master/client/src/Agrippa/Plugins).
Multiple *task*s may be backed by the same *plugin*, usually with different
configurations.

# Installation

1. Grab the latest [release](https://github.com/harryxp/Agrippa/releases) for
   your operating system.
2. Unzip it.
3. Create directory `~/.agrippa.d/` on Unix-like systems, %APPDATA%/agrippa.d
   (typically C:/Users/<user>/AppData/Roaming/agrippa.d) on Windows.  This is
   the directory that holds the configuration file of Agrippa .
4. Copy config.template.<your OS>.json to the directory in step 3.
   Rename it to config.json.
5. Customize your config.json.
6. Execute agrippad.

# Usage

While agrippad is running, visit its web interface at
[http://localhost:3000/agrippa/](http://localhost:3000/agrippa/).

This address is also configurable in config.json.

1. Please choose a task by typing a keyword, followed by a space.
2. Or, when a keyword is absent, the default task configured in config.json is chosen.
3. As you type, follow the instructions and feedback.

# History

I love productivity tools like [Alfred](https://www.alfredapp.com/) and
[Butler](https://manytricks.com/butler/), but I can't find one that

1. works across multiple operating systems;
2. offers no-fuss installation; and
3. can be configuraed with a simple file.

Therefore I created Agrippa.

It is named after [Marcus Vipsanius
Agrippa](https://en.wikipedia.org/wiki/Marcus_Vipsanius_Agrippa), right-hand
man of [Augustus](https://en.wikipedia.org/wiki/Augustus), _Princeps Civitatis_
of ancient Rome.
