FROM node:10

WORKDIR /usr/src/app

COPY COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 8000

CMD ["node", "main.js"]