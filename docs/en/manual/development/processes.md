# Processes

- Each backend app is a nodejs process running on its specified port
- Frontend app is packaged in nginx container and served as static assets
- Frontend container acts as reverse proxy exposing the nodejs app
