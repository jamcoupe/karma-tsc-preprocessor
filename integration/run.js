const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const dir = fs.readdirSync(__dirname);

let exit = 0;

const red = '\x1b[31m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';

function p(...args) {
  return path.resolve(...args);
}

for (const dirPath of dir) {
  console.log(`Testing ${dirPath}`);
  const rootPath = p(__dirname, '..');
  const srcFiles = ['package.json', 'index.js', 'src/get_typescript_compiler.js', 'src/tsc_preprocessor.js'];

  const resolvedDirPath = p(__dirname, dirPath);
  const dirPathStat = fs.statSync(resolvedDirPath);
  const karmaCommand = 'node_modules/.bin/karma';

  const tempDirs = [];

  if (dirPathStat.isDirectory()) {
    const commandPath = `tests/integration/${dirPath}`;

    const subDir = p(resolvedDirPath, 'node_modules');
    fs.removeSync(subDir);
    fs.copySync(p(rootPath, 'node_modules'), subDir);
    tempDirs.push(subDir);

    if (dirPath === 'oldTsc') {
      childProcess.spawnSync(`npm`, ['install', 'typescript@2.0.0'], { cwd: resolvedDirPath, stdio: 'inherit' });
    }

    // Make karma-tsc-preprocessor
    const karmaTscPreprocessorPath = p(resolvedDirPath, 'node_modules', 'karma-tsc-preprocessor');
    fs.removeSync(karmaTscPreprocessorPath);
    for (const srcFile of srcFiles) {
      fs.copySync(p(rootPath, srcFile), p(karmaTscPreprocessorPath, srcFile));
    }

    console.log(`${commandPath}$ ${karmaCommand} start`);
    const result = childProcess.spawnSync(karmaCommand, ['start'], { cwd: resolvedDirPath, stdio: 'inherit' });

    if (result.status !== 0) {
      console.log(red, `${dirPath} - failed`);
      exit = 1;
    } else {
      console.log(green, `${dirPath} - passed`);
    }

    for (const tempDir of tempDirs) {
      fs.removeSync(tempDir);
    }
  }
}

process.exit(exit);
