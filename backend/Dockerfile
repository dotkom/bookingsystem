# --- Installing stage
FROM node:alpine AS installer

WORKDIR /usr/src/app

ARG NODE_ENV=production
ARG NPM_TOKEN=
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm install --quiet

# ---

# Building stage
FROM installer AS builder

## Workdir is shared between the stage so let's reuse it as we neeed the packages
WORKDIR /usr/src/app

COPY ./src src
COPY tsconfig.json .
RUN npm run build


CMD [ "node", "build/server.js" ]
