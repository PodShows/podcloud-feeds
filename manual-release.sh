#!/bin/bash
set -ex

export REPO=podshows/podcloud-feeds
export COMMIT=$(git rev-parse --short=8 HEAD)
export TAG=latest

docker build -f Dockerfile -t $REPO:$COMMIT .
docker tag $REPO:$COMMIT $REPO:$TAG
docker push $REPO

exec ./deploy.sh
