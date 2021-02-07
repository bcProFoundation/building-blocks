FROM node:latest

ARG BUILD_ARGS="-- --prod"
# Copy and build app
COPY . /home/craft/authorization-client
WORKDIR /home/craft
RUN cd authorization-client \
    && npm install \
    && npm run build ${BUILD_ARGS}

FROM nginx:latest
COPY --from=0 /home/craft/authorization-client/dist/authorization-client /var/www/html
COPY ./docker/nginx-default.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./docker/docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
