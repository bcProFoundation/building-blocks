FROM node:latest
# Copy and build app
COPY . /home/craft/authorization-client
WORKDIR /home/craft
RUN cd authorization-client \
    && npm install \
    && npm run build

FROM nginx:latest
COPY --from=0 /home/craft/authorization-client/dist/authorization-client /var/www/html
COPY ./docker/nginx.conf /etc/nginx/conf.d/auth.conf
