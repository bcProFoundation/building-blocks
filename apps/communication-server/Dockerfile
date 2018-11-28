FROM node:latest
# Copy app
COPY . /home/craft/communication-server
WORKDIR /home/craft/
RUN rm -fr communication-server/config communication-server/docker-entrypoint.sh \
    && cd communication-server \
    && yarn \
    && yarn prestart:prod \
    && rm -fr node_modules yarn.lock \
    && yarn --production=true \
    && yarn cache clean

FROM node:slim
# Install mysql Dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh / # backwards compat

# Add non root user
RUN useradd -ms /bin/bash craft
WORKDIR /home/craft/communication-server
COPY --from=0 /home/craft/communication-server .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/communication-server

# Mount volume for files
RUN mkdir -p /home/craft/communication-server/files/public \
    /home/craft/communication-server/files/private

# Mount volume
VOLUME ["/home/craft/communication-server/files"]

# Expose port
EXPOSE 4100

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
