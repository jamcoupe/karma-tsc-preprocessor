# karma-tsc-preprocessor

> Preprocessor to compile TypeScript files with the latest features.

[![NPM][npm]](https://nodei.co/npm/karma-tsc-preprocessor/)

## Installation

Add `karma-tsc-preprocessor` as a devDependency in your `package.json`.
```json
    {
      "devDependencies": {
        "karma-tsc-preprocessor": "0.0.1"
      }
    }
```

Or just issue the following command:
```bash
npm install karma-tsc-preprocessor --save-dev
```

## Configuration
Below is two examples of how to use the preprocessor

Using a `tsconfig.json` file:
```js
    module.exports = function(config) {
        config.set({
            preprocessors: {
                '**/*.ts': ['tsc']
            },
            tscPreprocessor: {
                tsConfig: 'tsconfig.json' // relative to __dirname path
            }
        });
    };
```


Using a compilerOptions object:
```js
    module.exports = function(config) {
    	config.set({
    		preprocessors: {
    			'**/*.ts': ['tsc']
    		},
    
    		tscPreprocessor: {
    			compilerOptions: {
    				module: "umd",
    				target: "ES5",
    				noImplicitAny: true,
    				removeComments: true,
    				inlineSourceMap: true,
    				preserveConstEnums: true,
    				sourceRoot: '',
    				outDir: 'build'
    			}
    		}
    
    	});
    };
```

Notes:
- If you provide both `tsConfig` and `compilerOptions` then `tsConfig` will be chosen.
- Setting `sourceMap` to true currently emulates the `inlineSourceMap` behaviour.

Warning:
- The TypeScript compiler is built into this preprocessor. Which means that you could end up compiling against an older version during a release build which may produce unexpected results.

----

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com
[npm]: https://nodei.co/npm/karma-tsc-preprocessor.png