FROM node:latest
# Copy and build app
COPY . /home/craft/identity-client
WORKDIR /home/craft
RUN cd identity-client \
    && npm install \
    && npm run build

FROM nginx:latest
COPY --from=0 /home/craft/identity-client/dist/identity-client /var/www/html
COPY ./docker/nginx.conf /etc/nginx/conf.d/identity.conf
