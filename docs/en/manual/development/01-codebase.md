# Codebase

### Monorepo structure

```
apps - all developed microservices and apps
docs - Structure for gitbook docs book.json
libs - all libraries shared by microservices and apps
scripts - bash scripts used in CI
```

### Branches

#### develop

`develop` branch is in active development. All the Merge Requests go in this branch. All the forks must be taken of this branch.

#### staging

`develop` branch is merged into `staging` by maintainer or person who is going to publish release.

Once the branch is merged, command `lerna publish` is executed triggering a release on git and npm.

The `staging` branch is then pushed on upstream gitlab staging branch. This triggers a build for staging and a staging docker image is built and pushed on gitlab registry. Docker image version is the commit hash

Image has to be manually installed on staging servers (auto staging deployment will eventually be there).

#### master

Once all the testing by users is accepted on `staging` server and branch. The `staging` is merged into master by simple pull request.

If user doesn't accept `staging` the `develop` > `staging` cycle repeates unless user is satisfied.

Docker image for this branch is the latest version tag.
