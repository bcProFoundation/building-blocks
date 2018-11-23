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
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

### Setup /etc/hosts

add `127.0.0.1 myaccount.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Server with POST request

Add Client using Infrastructure console to obtain clientId, clientSecret. Use these to setup the server.

If a POST request with no body is sent to `http://myaccount.localhost:3200/setup` error response will specify required fields.

Use `clientId` and `clientSecret` from response of `authorization-server` setup.

```
curl -d "appURL=http://myaccount.localhost:3200" \
    -d "authServerURL=http://accounts.localhost:3000" \
    -d "clientId=6ff7dc34-2501-4281-bf8c-31929ed0f19c" \
    -d "clientSecret=05f966d683147329fbba11145482472188a19a11e6702c9aec54d86e42113b36" \
    -X POST http://myaccount.localhost:3200/setup \
    -H "Content-Type: application/x-www-form-urlencoded"
```

Sample response

```
Response 201
```

Login to Identity Provider to manage the user profile.