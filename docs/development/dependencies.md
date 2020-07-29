# Dependencies

### NestJS

Inspired by Angular. It is used to build backend for most of the apps as part of building blocks. Tests are written as per the documentation provided by NestJS.

### Angular

Modular, Opinionated and scalable. Angular mandates a structure to code. Tests are written as per the documentation provided by Angular.

### TypeScript, Formatting and Linting

All the code is built in TypeScript. Prettier (`npm run format`) does the formatting for projects. ts-lint (`npm run lint --fix`) checks and fixes the linting. This is checked as part of CI pipeline. Code format and linting errors will result in CI failure. `ts-lint` and `prettier` is used.

### Other languages

Check other repositories under the group for resource servers and client apps on other platform.

### Docpress

Docpress is used to generate documentation. Docpress should be installed globally. Following command executed from repo root will result in building of documentation.

```shell
docpress b
```

### Compodoc

Compodoc is used to generate API documentation from TypeScript Code. It is done as part of CI automatically and linked in documentation menu. To manually generate docs following command can be executed

```shell
npm run docs
```

### Lerna

Lerna is used to publish releases on git. Lerna is also used to bootstrap development environment.

App specific dependencies will be discussed in detail under app's section.
