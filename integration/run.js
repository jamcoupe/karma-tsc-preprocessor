const child_process = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const dir = fs.readdirSync(__dirname);

let exit = 0;

const red = "\x1b[31m%s\x1b[0m";
const green = "\x1b[32m%s\x1b[0m";

for (const dirPath of dir) {
  const rootPath = path.resolve(__dirname, "..");

  const srcFiles = ["package.json", "index.js", "src/get_typescript_compiler.js", "src/tsc_preprocessor.js"];

  const resolvedDirPath = path.resolve(__dirname, dirPath);
  const dirPathStat = fs.statSync(resolvedDirPath);
  const npmInstallCommand = "npm install --no-package-lock";
  const karmaCommand = "node_modules/.bin/karma";

  if (dirPathStat.isDirectory()) {
    const commandPath = `tests/integration/${dirPath}`;
    console.log(`${commandPath}$ ${npmInstallCommand}`);
    child_process.execSync(npmInstallCommand, {cwd: resolvedDirPath});

    const karmaTscPreprocessorPath = path.resolve(resolvedDirPath, "node_modules", "karma-tsc-preprocessor");

    fs.removeSync(karmaTscPreprocessorPath);

    for (const srcFile of srcFiles) {
      fs.copySync(path.resolve(rootPath, srcFile), path.resolve(karmaTscPreprocessorPath, srcFile));
    }

    console.log(`${commandPath}$ ${karmaCommand} start`);
    const result = child_process.spawnSync(karmaCommand, ["start"], {cwd: resolvedDirPath});

    for (const output of result.output) {
      if (output) {
        console.log(output.toString());
      }
    }

    if (result.status !== 0) {
      console.log(red, `${dirPath} - failed`);
      exit = 1;
    } else {
      console.log(green, `${dirPath} - passed`)
    }
  }
}

process.exit(exit);
