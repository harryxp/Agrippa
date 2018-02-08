#!/usr/bin/env bash

rm -rf dist/

mkdir -p dist
cp README.md config.template.*.json dist/

cd client/
pulp browserify -O --main Agrippa.Main --to web/js/agrippa.js
cp -R web ../dist/  # No trailing slash for web!  It matters on MacOS/BSD.

cd ../server
stack build && stack --local-bin-path ../dist build --copy-bins
