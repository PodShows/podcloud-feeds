#!/bin/sh

npm install -g pm2
pm2 deploy "${1}"
