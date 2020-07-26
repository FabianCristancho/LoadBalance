FROM node:12

WORKDIR /load_balance

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 8081

CMD ["npm", "start"]