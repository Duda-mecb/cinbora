FROM node:22-alpine

WORKDIR /app

COPY package*.json package-lock.json  ./

RUN npm install

COPY . .

EXPOSE 3011

CMD ["npm", "run", "server"]