# Create image based on the alpine Node 10 image from the dockerhub
FROM node:10-alpine
MAINTAINER Castlecraft

# Install mysql Dockerize
RUN apk add --no-cache openssl
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY docker/docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh / # backwards compat

# Create home directory for craft
WORKDIR /home/craft

# Add non root user
RUN adduser -h /home/craft -D craft

# Copy app
COPY . /home/craft/authorization-server

RUN rm -fr authorization-server/config authorization-server/docker-entrypoint.sh \
    && cd authorization-server \
    && yarn \
    && yarn prestart:prod \
    && rm -fr node_modules yarn.lock \
    && yarn --production=true \
    && yarn cache clean

# set project directory
RUN chown -R craft:craft /home/craft
USER craft
WORKDIR /home/craft/authorization-server

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
