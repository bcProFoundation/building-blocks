# Dependencies

### Libraries from this monorepo

- Ensure Loggedin Guard - It is useful few lines of code separated as library for reuse.
- Other libraries - Better already existing alternatives will be used. 

### NestJS

Inspired by Angular. It is used to build backend for most of the apps as part of building blocks. It enables modular app design and helps in code modularility, maintainability and scalability. It has features to build microservices. Tests are written as per the documentation provided by NestJS.

### Angular

Modular, Opinionated and scalable. Angular mandates a structure to code. Over the period this is necessary. As many teams start working on a codebase this structure ensures better collaboration, avoid merge conflicts, readability and understandability. Tests are written as per the documentation provided by Angular.

### TypeScript, Formatting and Linting

All the code is built in TypeScript. Prettier (`yarn format`) does the formatting for projects. ts-lint (`yarn lint --fix`) checks and fixes the linting. This is checked as part of CI pipeline. Code format and linting errors will result in CI failure.

### Other languages

Microservices are all about multiple languages and tools. Appropriate languages or tools will be added as required.

### Gitbook

Gitbook is used to generate documentation. Gitbook should be installed globally. Following command executed from repo root will result in building of gitbook

```sh
gitbook build docs public
```

### TypeDoc

TypeDoc is used to generate API documentation from TypeScript Code. It is done as part of CI automatically and linked in Gitbook's Summary menu. To manually generate docs following command can be executed

```sh
yarn docs
```

### Lerna

Lerna is used to publish releases on git and npm. Lerna is also used to bootstrap development environment.

App specific dependencies will be discussed in detail under app's section.

Please help to keep watch on deprecation warnings and report appropriate issue to keep libraries updated.
