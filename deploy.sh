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
BASE=/home/podcloud/production/services/feeds
KEEP_RELEASES=2

RELEASEN=$(date +%Y%m%d%H%M%S)

echo "Creating release"
ssh $SSH_HOST BASE=$BASE RELEASEN=$RELEASEN 'bash -s' <<'CMD'
 mkdir -vp $BASE/releases/$RELEASEN
CMD

rsync -avzPhc docker-compose.production.yml $SSH_HOST:$BASE/releases/$RELEASEN/docker-compose.yml
rsync -avzPhc config/ $SSH_HOST:$BASE/releases/$RELEASEN/config

ssh $SSH_HOST BASE=$BASE KEEP_RELEASES=$KEEP_RELEASES RELEASEN=$RELEASEN 'bash -s' <<'CMD'
# exit when any command fails
set -e

echo "Launching release"
cd $BASE/releases/$RELEASEN
scale=$(sed -rn 's@[ \t]*([a-Z0-9_\-]+):.*scale=([0-9]+)@\1=\2@p' docker-compose.yml | paste -s)
[ ! -z $scale ] && scale="--scale $scale"

docker-compose pull
eval docker-compose up $scale -d --remove-orphans

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
