# Developer Setup

### Have these installed
- Node JS latest is recommended for developers, it ensures future proof development.
- Database as per the app
- docker to build app images and to swap backing services while development
- lerna to bootstrap development setup
- gitbook for documentation
- `yarn` for package manager
- `angular-cli` for Angular development

#### Clone the monorepo develop branch

```sh
git clone https://gitlab.com/castlecraft/building-blocks --branch develop
```

more about branches in [codebase](/development/01-codebase.md) section.

#### Install root dependencies

change to building-blocks directory and run yarn

```sh
cd building-blocks
yarn
```

This will install jest, lerna, typedoc as monorepo's dev dependencies.

#### Install app dependencies

Run lerna bootstrap to download and install app dependencies 

```sh
lerna bootstrap
```

It will take time to download dependencies for each project and setup the enviroment. Libraries from the monorepo are not downloaded, they are used from local directory for easy development.

Rest of the development depends on app, Use any choice of IDE for development.
