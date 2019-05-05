FROM node:lts
# Copy and build app
COPY . /home/craft/admin-client
WORKDIR /home/craft
RUN cd admin-client \
    && npm install \
    && npm run build

FROM nginx:latest
COPY --from=0 /home/craft/admin-client/dist/admin-client /var/www/html
COPY ./docker/nginx.conf /etc/nginx/conf.d/admin.conf
