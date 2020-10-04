from node:14-stretch

workdir /srv

copy package.json yarn.lock ./

run yarn --production

copy . .

env START_SCRIPT=/srv/src/index.js \
    PORT=3000

entrypoint ["node", "$START_SCRIPT"]