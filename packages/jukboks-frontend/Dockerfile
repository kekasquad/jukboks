FROM node:16-slim AS builder

ARG API_BASE
ARG WS_BASE

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm build


FROM nginx:stable

COPY --from=builder /app/dist/ /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf