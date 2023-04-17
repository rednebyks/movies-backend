FROM node:16

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install
RUN npm install -g nodemon

ENV APP_PORT=8050

EXPOSE 8050

CMD [ "nodemon", "./src/index.js" ]