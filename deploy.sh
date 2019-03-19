#!/bin/bash
# exit when any command fails
set -e

# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG

# echo an error message before exiting
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR

SSH_HOST=podcloud@barry.podshows.fr
RELEASEN=$(date +%Y%m%d%H%M%S)
BASE=/home/podcloud/production/services/feeds

KEEP_RELEASES=2

echo "Creating folders"

ssh $SSH_HOST BASE=$BASE 'bash -s' <<'CMD'
 mkdir -p $BASE/releases
CMD

echo "Creating release"
rsync -avzPhc docker-compose.production.yml $SSH_HOST:$BASE/$RELEASEN/docker-compose.yml
rsync -avzPhc config $SSH_HOST:$BASE/$RELEASEN/config

ssh $SSH_HOST BASE=$BASE KEEP_RELEASES=$KEEP_RELEASES RELEASEN=$RELEASEN 'bash -s' <<'CMD'
# exit when any command fails
set -e

echo "Building release"
cd $BASE/releases/$RELEASEN
scale=$(sed -rn 's#[ \t]*([A-z_-]+):.*scale=([0-9]+)#\1=\2#p' docker-compose.yml)
[ ! -z $scale ] && scale="--scale $scale"

docker-compose pull
eval docker-compose up $scale -d --remove-orphans

echo "Linking release"
ln -nfs $BASE/releases/$RELEASEN $BASE/current

echo "Cleaning old releases"
cd $BASE/releases

RELEASES=$(ls -d */ | sort -r)
COUNT=$(echo "$RELEASES" | wc -l)

[ "$COUNT" -gt "$KEEP_RELEASES" ] && echo "$RELEASES" | tail -n -$(($COUNT-2)) | xargs rm -rvf
fi
CMD

echo
echo "Done!"
echo
