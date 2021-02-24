FROM node:latest
# Copy app
COPY . /home/craft/identity-provider
WORKDIR /home/craft/
RUN cd identity-provider \
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

# Add non root user
RUN useradd -ms /bin/bash craft
WORKDIR /home/craft/identity-provider
COPY --from=0 /home/craft/identity-provider .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/identity-provider

# Expose port
EXPOSE 3200

USER craft

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
