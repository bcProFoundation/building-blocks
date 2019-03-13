# Authorization Server Development

Complete the [development setup](/development/README.md)

### Setup Backing Services

#### Standard setup

Install mongodb locally using your OS specific installation for MongoDB.

#### Docker setup

Run following command as docker allowed user or root to start mongodb container.

```sh
docker run -d --name mongo -p 27017:27017 mongo
```

In both setup cases start backing services before app development starts.

### Setup Environment

`.env` file for initializing following variables needs to be setup in project root to configure environment. This file is ignored by git.

```
DB_HOST=mongo
DB_NAME=identity-provider
DB_USER=identity-provider
DB_PASSWORD=admin
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

### Setup hosts file

add `127.0.0.1 myaccount.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Setup server with POST request

`identity-provider` needs to have first client (app), i.e `identity-provider` for administration dashboard for all apps, users, roles, scopes and general settings.

If a POST request with a body is sent to `http://accounts.localhost:3000/setup` response with required fields would be sent to url `http://accounts.localhost:3200` as per defined inside `./scripts/setupwiz.py`

- Run the script

```
./scripts/setupwiz.py add-client your@email.com secret http://admin.localhost:3000 "Identity Provider" http://myaccount.localhost:3200
```
Above script would store the `clientId` and `clientSecret` from response to setup infrastructure console.

- sample
```
./scripts/setupwiz.py add-client prafful@mntechnique.com secret http://admin.localhost:3000 "Identity Provider" http://myaccount.localhost:3200
```

- Expected response

```
<Response [201]>
```
Login to Identity Provider to manage the user profile.