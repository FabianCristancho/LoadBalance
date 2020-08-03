FROM node:12

WORKDIR /load_balance

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 8085

CMD ["npm", "start"]
