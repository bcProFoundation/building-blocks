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
DB_NAME=infrastructure-console
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

### Setup /etc/hosts

add `127.0.0.1 admin.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Server with POST request

`authorization-server` needs to have first client (app), i.e `infrastructure-console` for administration dashboard for all apps, users, roles, scopes and general settings.

If a POST request with no body is sent to `http://admin.localhost:5000/setup` error response will specify required fields.

Use `clientId` and `clientSecret` from response of `authorization-server` setup.

```
curl -d "appURL=http://admin.localhost:5000" \
    -d "authServerURL=http://accounts.localhost:3000" \
    -d "clientId=67e506ca-7da3-43c1-9045-3f5d42711362" \
    -d "clientSecret=188a19a11e05f966d683147329fbba111454824726702c9aec54d86e42113b36" \
    -X POST http://admin.localhost:5000/setup \
    -H "Content-Type: application/x-www-form-urlencoded"
```

Sample response

```
Response 201
```

Once Infrastructure Console is setup login and add additional Trusted Clients for Identity Provider and Communication Server, etc.
