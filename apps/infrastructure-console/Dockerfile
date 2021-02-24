FROM node:latest
# Copy app
COPY . /home/craft/infrastructure-console
WORKDIR /home/craft/
RUN cd infrastructure-console \
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
WORKDIR /home/craft/infrastructure-console
COPY --from=0 /home/craft/infrastructure-console .

RUN chown -R craft:craft /home/craft

# set project directory
WORKDIR /home/craft/infrastructure-console

# Expose port
EXPOSE 5000

USER craft

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["start"]
