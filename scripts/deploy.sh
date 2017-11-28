#!/bin/bash
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
PROJECT_ROOT="$( cd -P "$( dirname "$SOURCE" )" && cd .. && pwd )"

if [[ -z "${1}" ]]; then
  >&2 echo "No environment given"
  exit 1
fi

PM2=$PROJECT_ROOT/node_modules/.bin/pm2;

$PM2 deploy "${1}";