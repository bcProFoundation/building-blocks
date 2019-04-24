# Authorization Server Development

Complete the [development setup](/development/README.md)

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

- Run the script

```
./scripts/setupwiz.py add-client your@email.com Secret@2019 http://admin.localhost:3000 "Identity Provider" http://myaccount.localhost:3200
```

Above script would store the `clientId` and `clientSecret` from response to setup app.

- Expected response

```
<Response [201]>
```

Login to Identity Provider to manage the user profile.
