FROM node:18-alpine

WORKDIR /usr/src/backend

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD sh -c "npm run watch & npm run dev"
