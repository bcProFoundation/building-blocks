module.exports = {
    excludeExternals: true,
    mode: "modules",
    theme: "minimal",
    ignoreCompilerErrors: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    target: "es6",
    moduleResolution: "node",
    preserveConstEnums: true,
    stripInternal: true,
    suppressExcessPropertyErrors: true,
    suppressImplicitAnyIndexErrors: true,
    module: "commonjs",
    exclude: [
        "**/*.spec.ts",
        "node_modules"
    ],
    lib: [
        "lib.es2017.d.ts",
        "lib.dom.d.ts"
    ],
    typeRoots: [
        "typings",
        "node_modules/@types"
    ],
    types: [
        "node"
    ]
}
