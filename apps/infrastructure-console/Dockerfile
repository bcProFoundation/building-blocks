FROM node:latest
# Copy app
COPY . /home/craft/infrastructure-console
WORKDIR /home/craft/
RUN cd infrastructure-console \
    && npm install \
    && npm run build \
    && rm -fr node_modules \
    && npm install --only=production

FROM node:slim
# Install Dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN apt-get update \
    && apt-get install -y wget \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && apt-get purge -y wget \
    && apt-get clean

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh
RUN ln -s usr/local/bin/docker-entrypoint.sh / # backwards compat

# Add non root user
RUN useradd -ms /bin/bash craft
WORKDIR /home/craft/infrastructure-console
COPY --from=0 /home/craft/infrastructure-console .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/infrastructure-console

# Expose port
EXPOSE 5000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
