# Create image based on the alpine Node 10 image from the dockerhub
FROM node:10-alpine
MAINTAINER Castlecraft

# Install mysql client
RUN apk update \
    && apk add --no-cache \
    mysql-client \
    git \
    tar

# Install typescript and craft cli
RUN yarn --production=true global add typescript "https://gitlab.com/castlecraft/craft-cli" \
    && yarn cache clean \
    && mkdir -p /home/craft/identity-provider

COPY docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh / # backwards compat

# Create home directory for craft
WORKDIR /home/craft

# Add non root user
RUN adduser -h /home/craft -D craft
RUN chown -R craft:craft /home/craft
USER craft

# Image
COPY . /home/craft/identity-provider

RUN rm -fr identity-provider/config identity-provider/docker-entrypoint.sh identity-provider/package-lock.json \
    && cd identity-provider \
    && yarn \
    && yarn prestart:prod \
    && rm -fr node_modules yarn.lock \
    && yarn --production=true \
    && yarn cache clean \
    && mkdir -p /home/craft/identity-provider/config

# set project directory
WORKDIR /home/craft/identity-provider
VOLUME /home/craft/identity-provider/config

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
