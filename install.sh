set -euo pipefail

LATEST_VER=0.3
OS=Linux # TODO

mkdir -p ~/.agrippa
curl -L https://github.com/harryxp/Agrippa/releases/download/v${LATEST_VER}/Agrippa-${LATEST_VER}.${OS}.tar.gz 2> /dev/null | tar -xz -C ~/.agrippa

echo Agrippa installed under \"~/.agrippa/Agrippa-${LATEST_VER}.${OS}/\".
# TODO a wrapper script?
echo Execute \"~/.agrippa/Agrippa-${LATEST_VER}.${OS}/agrippad ~/.agrippa/Agrippa-${LATEST_VER}.${OS}/web/\" to start the server.

# TODO install config.yaml
