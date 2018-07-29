# Create image based on the official Node 6 image from the dockerhub
FROM node:10-alpine
MAINTAINER Castlecraft

# Install mysql client
RUN apk add \
    mysql-client \
    git \
    tar

# Install typescript and craft cli
RUN yarn global add typescript "https://gitlab.com/castlecraft/craft-cli"

# Create app directory
WORKDIR /usr/src/app

# Get all the code needed to run the app
COPY package.json /usr/src/app

RUN yarn install --production=true

# Bundle app source
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 3000
