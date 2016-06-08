#!/usr/bin/env bash
# Run this on the server, not client

cd ~/inkanban

git fetch --all
git reset --hard origin/master

BUILDNUMBER=`git symbolic-ref HEAD 2> /dev/null | cut -b 12-`-`git log --pretty=format:%h -1`
echo $BUILDNUMBER

sed -i "s/build-number/build-number\ Build:\ $BUILDNUMBER/g" views/user/user-layout.jade
sed -i "s/build-number/build-number\ Build:\ $BUILDNUMBER/g" views/admin/layout.jade

npm install

cd db

npm install

if [ "$1" == "db" ]; then
  echo "refresh database!"
  node loadDb.js
fi

~/bin/stop.sh

~/bin/start.sh