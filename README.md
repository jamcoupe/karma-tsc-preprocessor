# karma-tsc-preprocessor

> Karma Preprocessor that compiles your TypeScript files.

[![NPM][npm]](https://nodei.co/npm/karma-tsc-preprocessor/)

## Installation

Add `karma-tsc-preprocessor` as a `devDependency` in your `package.json`.

```json
{
  "devDependencies": {
    "karma-tsc-preprocessor": "1.0.0"
  }
}
```

Or just issue the following command:
```bash
npm install karma-tsc-preprocessor --save-dev
```

## Configuration

### Default `tsconfig.json`

Using an existing `tsconfig.json` file:

```js
module.exports = function(config) {
  config.set({
    bastPath: ".",
    preprocessors: {
      '**/*.ts': ['tsc']
    },
    plugins: [
      "karma-tsc-preprocessor",
    ],
  });
};
```

You do not need to pass the `tsc` options if you want to use your existing `tsconfig.json` file that is relative to the `basePath` property

---

### Non standard `tsconfig` file

Using an existing `tsconfig` file with a non standard file name, for example `tsconfig.tests.json`:

```js
module.exports = function(config) {
  config.set({
    bastPath: ".",
    preprocessors: {
      '**/*.ts': ['tsc']
    },
    tsc: {
      configFile: 'tsconfig.tests.json'
    },
    plugins: [
      "karma-tsc-preprocessor",
    ],
  });
};
```

---

### Inline compiler options

Using a `compilerOptions` object:

```js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.ts': ['tsc']
    },
    tsc: {
      compilerOptions: {
        module: "commonjs",
        target: "es5",
        sourceMap: true,
      }
    },
    plugins: [
      "karma-tsc-preprocessor",
    ],
  });
};
```

## Usage

### Plugin behaviour

*   `configFile` property takes precedence over `compilerOptions`.
*   Setting `sourceMap` to true emulates the `inlineSourceMap` behaviour.

### Examples

See [integration folder](integration) for example projects.

### Version support

`typescript` is a peer dependency so consumers can use any supported version.

*   **`TypeScript`** version **`>= 2.0.0`** are supported.
*   **`Node.js`** version **`>= 8.16.0`** are supported.

---

For more information on Karma see the [homepage](http://karma-runner.github.com).

[npm]: https://nodei.co/npm/karma-tsc-preprocessor.png
