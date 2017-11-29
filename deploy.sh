#!/bin/bash

npm install pm2
node_modules/.bin/pm2 deploy "${1}"
