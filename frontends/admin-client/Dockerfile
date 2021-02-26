FROM node:latest

ARG BUILD_ARGS="-- --prod"
# Copy and build app
COPY . /home/craft/admin-client
WORKDIR /home/craft
RUN cd admin-client \
    && npm install \
    && npm run build ${BUILD_ARGS}

FROM nginxinc/nginx-unprivileged:latest
COPY --from=0 /home/craft/admin-client/dist/admin-client /var/www/html
COPY ./docker/nginx-default.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./docker/docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
