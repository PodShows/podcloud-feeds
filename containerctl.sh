#!/bin/bash

[ -z $COMPOSE_FILE ] && COMPOSE_FILE="docker-compose.yml"

pname=$(sed -rn 's@.*project_name=([A-z0-9_\-]+)@\1@p' $COMPOSE_FILE)
[ ! -z $pname ] && COMPOSE_PROJECT_NAME=$pname
scales=$(sed -rn 's@[ \t]*([A-z0-9_\-]+):.*scale=([0-9]+)@\1=\2@p' $COMPOSE_FILE | paste -s)
[ ! -z $scales ] && scales="--scale $scales"

case "$1" in

up)
    docker-compose up $scales
    ;;
*)
    docker-compose $@
   ;;
esac
