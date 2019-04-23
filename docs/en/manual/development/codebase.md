# Codebase

### Monorepo structure

```
apps - all developed microservices and apps
docker - files related to setup backing services for development of building-blocks
docs - Structure for gitbook docs book.json
frontends - all developed UI frontend
kubernetes - resources and scripts related to kubernetes
scripts - bash scripts used in CI and setup
```

### Branches

#### develop

`develop` branch is in active development. All the Merge Requests go in this branch. All the forks must be taken of this branch.

#### staging

`develop` branch is merged into `staging` by maintainer or person who is going to publish release.

Once the branch is merged, command `lerna publish` is executed triggering a release tag for git.

The `staging` branch is then pushed on upstream gitlab staging branch. This triggers a build for staging and a staging docker image is built and pushed on gitlab registry. Docker image version is the commit hash. and tagged as `edge`

It deploys the services under staging namespace on kubernetes cluster.

#### master

Once all the testing by users is accepted on `staging` server and branch. The `staging` is merged into master by simple pull request.

If user doesn't accept `staging` the `develop` > `staging` cycle repeats unless user is satisfied.

Docker image for this branch has the `latest` version tag and also has version number.
