#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/../..

SSH_HOST=podcloud@barry.podshows.fr
RELEASEN=$(date +%Y%m%d%H%M%S)
BASE=/home/podcloud/production/services/feeds/

KEEP_RELEASES=2

echo "Creating folders"

ssh $SSH_HOST 'bash -s' <<'CMD'
 mkdir -p $BASE/releases
CMD

echo "Creating release"
rsync -avzP . $SSH_HOST:$BASE/$RELEASEN

ssh $SSH_HOST KEEP_RELEASES=$KEEP_RELEASES RELEASEN=$RELEASEN 'bash -s' <<'CMD'
echo "Building release" &&
cd $BASE/releases/$RELEASEN && ./up.sh &&

echo "Linking release" &&
ln -nfs $BASE/releases/$RELEASEN $BASE/current;

echo "Cleaning old releases"
cd $BASE/releases;

RELEASES=$(ls -d */ | sort -r);
COUNT=$(echo "$RELEASES" | wc -l);

if [ "$COUNT" -gt "$KEEP_RELEASES" ]; then
    echo "$RELEASES" | tail -n -$(($COUNT-2)) | xargs rm -rvf;
fi
CMD

echo
echo "Done!"
echo
