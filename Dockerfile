# base image
FROM node:16.16.0-alpine

# install git
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# set working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn
RUN npm install react-scripts@3.4.1 -g