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
