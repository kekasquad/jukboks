FROM node:16-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG API_BASE
ENV API_BASE=${API_BASE}
ARG WS_BASE
ENV WS_BASE=${WS_BASE}

RUN npm run build

FROM nginx:stable

COPY --from=builder /app/dist/ /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf