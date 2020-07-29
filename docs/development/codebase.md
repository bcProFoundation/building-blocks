# Codebase

### Monorepo structure

- apps - all developed microservices and apps
- docker - files related to setup backing services for development of building-blocks
- docs - Structure for gitbook docs book.json
- frontends - all developed UI frontend
- kubernetes - resources and scripts related to kubernetes
- scripts - bash scripts used in CI and setup

### Branches

#### develop

`develop` branch is in active development. All the Merge Requests go in this branch. All the forks must be taken of this branch.

Merge to this branch triggers a build for docker images. Images are built and pushed on gitlab registry. Docker image version is tagged as `edge`

#### master

The `develop` is merged into master by simple pull request.

Docker image for this branch has the `latest` version tag and also has version number.

It also triggers gitlab pages and helm repository build
