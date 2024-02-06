FROM node:14
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

RUN npm config --global set user root

RUN npm install --global nodemon

COPY . .

EXPOSE 4000

CMD ["nodemon", "app.ts"]
