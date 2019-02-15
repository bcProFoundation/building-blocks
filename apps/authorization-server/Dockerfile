FROM node:latest
# Copy and build app
COPY . /home/craft/authorization-server
WORKDIR /home/craft/
RUN cd authorization-server \
    && npm install \
    && npm run prestart:prod \
    && rm -fr node_modules \
    && npm install --only=production

FROM node:slim
# Install mysqfl Dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh / # backwards compat

# Add non root user and set home directory
RUN useradd -ms /bin/bash craft
WORKDIR /home/craft/authorization-server
COPY --from=0 /home/craft/authorization-server .
RUN chown -R craft:craft /home/craft

# Create volume directory
RUN mkdir -p /home/craft/authorization-server/files

# Mount volume
VOLUME ["/home/craft/authorization-server/files"]

# Expose port
EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
