FROM node:latest
# Copy app
COPY . /home/craft/communication-server
WORKDIR /home/craft/
RUN cd communication-server \
    && npm install \
    && npm run build \
    && rm -fr node_modules \
    && npm install --only=production

FROM node:slim
# Install dependencies
RUN apt-get update \
    && apt-get install -y gettext-base \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh

# Add non root user
RUN useradd -ms /bin/bash craft
WORKDIR /home/craft/communication-server
COPY --from=0 /home/craft/communication-server .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/communication-server

# Expose port
EXPOSE 4100

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
