FROM node:latest
# Copy and build app
COPY . /home/craft/authorization-server
WORKDIR /home/craft/
RUN cd authorization-server \
    && npm install \
    && npm run build \
    && npm install --only=production

FROM node:slim
# Install dependencies
RUN apt-get update \
    && apt-get install -y gettext-base \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup docker-entrypoint
COPY docker/docker-entrypoint.sh usr/local/bin/docker-entrypoint.sh

# Add non root user and set home directory
RUN useradd -ms /bin/bash craft
WORKDIR /home/craft/authorization-server
COPY --from=0 /home/craft/authorization-server .
RUN chown -R craft:craft /home/craft

# Expose port
EXPOSE 3000

USER craft

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
