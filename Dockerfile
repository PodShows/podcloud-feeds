FROM node:10.15.3 as runner

WORKDIR /usr/src/app

EXPOSE 80

CMD ["npm", "start"]

FROM runner as builder

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM runner as podcloud-feeds

COPY package*.json ./
COPY --from=builder /usr/src/app/dist .

RUN npm ci --only=production

ENV NODE_ENV=production

CMD [ "node", "podcloud-feeds.js" ]
