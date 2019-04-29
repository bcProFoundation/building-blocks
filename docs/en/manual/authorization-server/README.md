# Authorization Server Development

Complete the [development setup](/development/README.md)

### Setup Environment

`.env` file for initializing following variables needs to be setup in project root to configure environment. This file is ignored by git.

```
SESSION_SECRET=secret
EXPIRY_DAYS=1
COOKIE_MAX_AGE=43200
SESSION_NAME=AS_SESSION
TOKEN_VALIDITY=3600
DB_HOST=localhost
DB_NAME=authorization-server
DB_USER=authorization-server
DB_PASSWORD=admin
BULL_QUEUE_REDIS_HOST=localhost
BULL_QUEUE_REDIS_PORT=6379
BULL_QUEUE_REDIS_PASSWORD=admin
```

Note: It is important to change the secrets and password. DO NOT USE example passwords or secrets.

### Setup hosts file

add `127.0.0.1 *.localhost` in `/etc/hosts` file or hosts file of your operating system.

### Setup server with POST request

`authorization-server` needs to have first client (app), i.e `infrastructure-console` for administration dashboard for all apps, users, roles, scopes and general settings.

- Run the script

```
./scripts/setupwiz.py setup-as http://accounts.localhost:3000 Administrator your@email.com Secret@9000 +919876543210 http://admin.localhost:5000
```

Above script would store the `clientId` and `clientSecret` from response to setup Authorization Server.


- Expected response
```
<Response [201]>
```
-Note
```
   The password must be at least 10 characters long 
   The password must contain at least one uppercase letter,
   least one number and least one special character.
   phone must be MobileE164. (ie. +911234567890)

   If you see any response other response such as 400 try the manual way,
   making post request on /setup rest endpoint from something like postman or rester add your request parameters to your body,

   appURL : http://accounts.example.com,
   email  : your@email.com,
   infrastructureConsoleUrl : http://admin.example.com,
   adminPassword : Admin@123,
   phone : +911234567890,
   issuerUrl : http://accounts.example.com,
   fullName : Your_full_name
   
   Response should be something like
   {
    "redirectUris": [
        "http://admin.example.com/index.html",
        "http://admin.example.com/silent-refresh.html"
    ],
    "allowedScopes": [],
    "uuid": "67cda72c-d214-4b87-a8a2-fcd2acc9c978",
    "clientId": "68c373e0-cf3f-46d6-88b4-d56192eb392c",
    "clientSecret": "b71915d04dccbda33f99c8d15e677c6da30ebb657910f9cfd0d0b971e7af07c1",
    "name": "Infrastructure Console",
    "isTrusted": 1,
    "userDeleteEndpoint": "http://admin.example.com/connect/v1/user_delete",
    "tokenDeleteEndpoint": "http://admin.example.com/connect/v1/token_delete"
    }

    take clientId, clientSecret from above response and setup infrastructure-console similarly.
```

This sets up Authorization Server as well as Infrastructure Console
