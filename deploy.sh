#!/bin/bash
# exit when any command fails
set -e

# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG

# echo an error message before exiting
trap '[ $? -ne 0 ] && echo "\"${last_command}\" command filed with exit code $?."' EXIT

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR

SSH_HOST=podcloud@barry.podshows.fr
SSH_PORT=4242
COMPOSE_PROJECT_NAME=podcloud
BASE=/home/podcloud/production/services/feeds
KEEP_RELEASES=2

RELEASEN=$(date -u +%Y%m%d%H%M%S)

echo "Creating release"
ssh -p$SSH_PORT $SSH_HOST BASE=$BASE RELEASEN=$RELEASEN 'bash -s' <<'CMD'
 mkdir -vp $BASE/releases/$RELEASEN
CMD

rsync -e "ssh -p$SSH_PORT" -avzPhc --recursive --files-from=deploy.files . $SSH_HOST:$BASE/releases/$RELEASEN/

ssh -p$SSH_PORT $SSH_HOST BASE=$BASE KEEP_RELEASES=$KEEP_RELEASES RELEASEN=$RELEASEN COMPOSE_PROJECT_NAME=$COMPOSE_PROJECT_NAME 'bash -s' <<'CMD'
# exit when any command fails
set -e

echo "Launching release"
cd $BASE/releases/$RELEASEN

mv docker-compose.production.yml docker-compose.yml

./containerctl.sh pull
./containerctl.sh up -d --remove-orphans

echo "Linking release"
ln -nfs $BASE/releases/$RELEASEN $BASE/current

cd $BASE/releases

RELEASES=$(ls -1d */ | sort -r)
COUNT=$(echo "$RELEASES" | wc -l)

if [ "$COUNT" -gt "$KEEP_RELEASES" ]; then
  echo "Cleaning old releases"
  echo "$RELEASES" | tail -n +3 | xargs rm -rvf
fi
CMD

echo
echo "Done!"
echo
