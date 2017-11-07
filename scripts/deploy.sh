#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && cd .. && pwd )"

APP_NAME="feeds"
APP_BIN="npm"
APP_ARGS="start"

deploy() {
  deploy_env=$1

  if [ "$deploy_env" = "staging" ]; then
    echo "not supported yet"
    exit 5
  elif [ "$deploy_env" = "production" ]; then
    DEPLOY_USER="podcloud"
    DEPLOY_HOST="eve.podradio.fr"
    DEPLOY_DIR="/home/podcloud/production/feeds"
  fi

  ssh-keyscan $DEPLOY_HOST >> ~/.ssh/known_hosts

  ssh $DEPLOY_USER@$DEPLOY_HOST /bin/bash bash -c "mkdir -p $DEPLOY_DIR"

  rsync -avzPL --delete-after $DIR/ $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_DIR

  CMD="new_app=\$(pm2 show $APP_NAME > /dev/null 2>&1 ; echo \$?); [[ \$new_app = 1 ]] && cd $DEPLOY_DIR && /usr/bin/pm2 start $APP_BIN --name \"$APP_NAME\" -- $APP_ARGS || /usr/bin/pm2 restart $APP_NAME"

  ssh $DEPLOY_USER@$DEPLOY_HOST /bin/bash -c "${CMD}"
}

deploy_envs=("staging" "production")

usage() {
  echo "${0} [DEPLOY_ENV]"
  echo ""
  echo -e "Available deploy environements : "
  for i in "${deploy_envs[@]}"; do
    echo -e "\t - $i"
  done
}

if [[ -z "${1}" ]]; then
  usage
  echo ""
  >&2 echo "No environment given"
  exit 1
fi

if [[ ! " ${deploy_envs[@]} " =~ " ${1} " ]]; then
  usage
  echo ""
  >&2 echo "Invalid environment: ${1}"
  exit 1
fi

deploy $1
