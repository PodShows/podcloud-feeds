#!/bin/bash

[ -z $COMPOSE_FILE ] && COMPOSE_FILE="docker-compose.yml"

if [[ -r $COMPOSE_FILE ]]; then
    pname=$(sed -rn 's@.*project_name=([a-zA-Z0-9_\-]+)@\1@p' $COMPOSE_FILE)
    [ ! -z $pname ] && export COMPOSE_PROJECT_NAME=$pname
    scales=$(sed -rn 's@[ \t]*([a-zA-Z0-9_\-]+):.*scale=([0-9]+)@\1=\2@p' $COMPOSE_FILE | paste -s)
    [ ! -z $scales ] && scales="--scale $scales"
fi

case "$1" in

up)
    shift # shift arguments to remove "up"
    docker-compose up $scales $@
    ;;
*)
    docker-compose $@
   ;;
esac
