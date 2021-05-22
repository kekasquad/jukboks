FROM node:16-slim

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["node", "./src/app.js"]