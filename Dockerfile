FROM node:current-alpine3.13
WORKDIR /usr/src/project

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]