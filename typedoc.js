module.exports = {
    emitDecoratorMetadata: true,
    exclude: [
        "**/*.spec.ts",
        "node_modules",
    ],
    excludeExternals: true,
    experimentalDecorators: true,
    ignoreCompilerErrors: true,
    lib: [
        "lib.es2017.d.ts",
        "lib.dom.d.ts",
    ],
    mode: "file",
    module: "commonjs",
    moduleResolution: "node",
    preserveConstEnums: true,
    stripInternal: true,
    suppressExcessPropertyErrors: true,
    suppressImplicitAnyIndexErrors: true,
    target: "es6",
    theme: "minimal",
    typeRoots: [
        "typings",
        "node_modules/@types",
    ],
    types: [
        "node",
    ],
};
