FROM node:latest
# Copy app
COPY . /home/craft/identity-provider
WORKDIR /home/craft/
RUN rm -fr identity-provider/config identity-provider/docker-entrypoint.sh \
    && cd identity-provider \
    && yarn \
    && yarn prestart:prod \
    && rm -fr node_modules yarn.lock \
    && yarn --production=true \
    && yarn cache clean

FROM node:slim
# Install Dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh / # backwards compat

# Add non root user
RUN useradd -ms /bin/bash craft
WORKDIR /home/craft/identity-provider
COPY --from=0 /home/craft/identity-provider .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/identity-provider

# Mount volume for files
RUN mkdir -p /home/craft/identity-provider/files/public \
    /home/craft/identity-provider/files/private

# Mount volume
VOLUME ["/home/craft/identity-provider/files"]

# Expose port
EXPOSE 3200

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
