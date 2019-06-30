# karma-tsc-preprocessor

[![code quality](https://img.shields.io/codacy/grade/b5ab0d0605bb4be288d1469e060f8f87.svg)](https://www.codacy.com/app/jcouperwhite/karma-tsc-preprocessor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jamcoupe/karma-tsc-preprocessor&amp;utm_campaign=Badge_Grade)
[![coverage](https://img.shields.io/codacy/coverage/b5ab0d0605bb4be288d1469e060f8f87.svg)](https://www.codacy.com/app/jcouperwhite/karma-tsc-preprocessor?utm_source=github.com&utm_medium=referral&utm_content=jamcoupe/karma-tsc-preprocessor&utm_campaign=Badge_Coverage)
[![tests](https://img.shields.io/circleci/build/github/jamcoupe/karma-tsc-preprocessor/dev.svg?label=tests)](https://circleci.com/gh/jamcoupe/karma-tsc-preprocessor/tree/dev)
[![dev deps](https://img.shields.io/david/dev/jamcoupe/karma-tsc-preprocessor.svg)](https://www.npmjs.com/package/karma-tsc-preprocessor)
[![peer deps](https://img.shields.io/david/peer/jamcoupe/karma-tsc-preprocessor.svg)](https://www.npmjs.com/package/karma-tsc-preprocessor)
[![version](https://img.shields.io/npm/v/karma-tsc-preprocessor.svg)](https://www.npmjs.com/package/karma-tsc-preprocessor)

> Karma Preprocessor that compiles your TypeScript files.

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
