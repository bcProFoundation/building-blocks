# Quick setup

1. Setup env variables in /etc/hosts file

```shell
   127.0.0.1 accounts.localhost
   127.0.0.1 connect.localhost
   127.0.0.1 myaccount.localhost
   127.0.0.1 admin.localhost
```

2. Navigate to docker folder and run the following command for the backend service

```shell
   docker compose -p lixi-frontend -f lixi-frontend.yaml up
```

3. After that, open a new terminal and run the following command for frontend service

```shell
   docker compose -p lixi-frontend -f lixi-frontend.yaml up
```

4. After confirming both services are running, run the python setup-wizard in scripts folder

```shell
   ./scripts/setup-wizard
```

5. Command will result in following output

```
   Setting Up Authorization Server and Infrastructure Console

   Creating Clients
   Setup Identity Provider
   Setup Communication Server

   Update auth server settings for Example Inc.

   Visit Admin URL http://admin.localhost:4220
   Login using email 'admin@example.com' or phone '+919876543210'
   Use the password configured during setup wizard, default password Secret@1234

   URLs :
   Authorization Server http://accounts.localhost:4210
   Communication Server http://connect.localhost:4100
   Identity Provider http://myaccount.localhost:4420
```

6. Go to [Admin Console](http://admin.localhost:4220) and login with username and password from above command output

7. Create a new client for Lixilotus with openid, roles, email, profile, phone.

8. After created, get Client Id and Client Secret and add to LixiLotus .env