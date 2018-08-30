# Pipeline

### Tests

- NodeJS dependencies are installed for repo
- Lerna bootstraps all the packages and libraries
- All libraries are checked for lint errors
- All libraries are checked for format errors
- All backend unit tests are executed (Async)
- All backend E2E tests are executed one by one
- All client side tests are executed one by one

### Packing

- Docker image is built from the `Dockerfile` from the app's root (not repo root).
- Docker image is tagged the commit hash for `staging` branch version
- Docker image is tagged the latest git tag for the app in `master` branch.
- The image is pushed on gitlab repo's public registry.

### Documentation

- `gitbook` build documentation from book structured in `docs` directory.
- make changes to the `docs` directory and commit to update documentation.
- hard coded base url for api docs generated by typedoc has to be added to gitbook's doc e.g. [reference code](https://gitlab.com/castlecraft/building-blocks/blob/develop/docs/manual/SUMMARY.md#L7)
- `public` directory is git ignored as it is generated from docs and code changes.
- To generate and tests docs locally you must have gitbook and http-server installed globally (nodejs packages). Execute following commands to check documentation locally

```
gitbook build docs public
yarn docs
http-server public
```