#!/usr/bin/env bash

mkdir -p dist
cp README.md config.template.linux.json config.template.mac.json dist/

cd client/
pulp browserify -O --main Agrippa.Main --to web/js/agrippa.js
cp -r web/ ../dist/

cd ../server
stack build && stack --local-bin-path ../dist build --copy-bins
