const child_process = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const dir = fs.readdirSync(__dirname);

let exit = 0;

const red = "\x1b[31m%s\x1b[0m";
const green = "\x1b[32m%s\x1b[0m";

function p(...args) {
  return path.resolve(...args);
}

for (const dirPath of dir) {
  console.log(`Testing ${dirPath}`);
  const rootPath = p(__dirname, "..");

  const srcFiles = ["package.json", "index.js", "src/get_typescript_compiler.js", "src/tsc_preprocessor.js"];

  const resolvedDirPath = p(__dirname, dirPath);
  const dirPathStat = fs.statSync(resolvedDirPath);
  const npmInstallCommand = "npm install --no-package-lock";
  const karmaCommand = "node_modules/.bin/karma";

  if (dirPathStat.isDirectory()) {
    const commandPath = `tests/integration/${dirPath}`;

    const packageJson = p(resolvedDirPath, "package.json");

    if (fs.existsSync(packageJson)) {
      const subDir = p(resolvedDirPath, "node_modules");
      const tempNodeModules = p(resolvedDirPath, "node_modules_temp");
      fs.removeSync(subDir);
      fs.removeSync(tempNodeModules);

      fs.copySync(p(rootPath, "node_modules"), tempNodeModules);
      fs.removeSync(p(tempNodeModules, ".bin"));
      // TODO(jamcoupe): We are assuming we only want to test typescript versions
      fs.removeSync(p(tempNodeModules, "typescript"));

      console.log(`${commandPath}$ ${npmInstallCommand}`);
      child_process.execSync(npmInstallCommand, {cwd: resolvedDirPath, stdio: "inherit"});

      fs.copySync(tempNodeModules, subDir);
      fs.copySync(p(rootPath, "node_modules", ".bin", "karma"), p(resolvedDirPath, "node_modules", ".bin", "karma"))
      fs.removeSync(tempNodeModules);
    } else {
      const subDir = p(resolvedDirPath, "node_modules");
      fs.removeSync(subDir);
      fs.copySync(p(rootPath, "node_modules"), subDir);
    }

    // Make karma-tsc-preprocessor
    const karmaTscPreprocessorPath = p(resolvedDirPath, "node_modules", "karma-tsc-preprocessor");
    fs.removeSync(karmaTscPreprocessorPath);
    for (const srcFile of srcFiles) {
      fs.copySync(p(rootPath, srcFile), p(karmaTscPreprocessorPath, srcFile));
    }

    console.log(`${commandPath}$ ${karmaCommand} start`);
    const result = child_process.spawnSync(karmaCommand, ["start"], {cwd: resolvedDirPath, stdio: "inherit"});

    if (result.status !== 0) {
      console.log(red, `${dirPath} - failed`);
      exit = 1;
    } else {
      console.log(green, `${dirPath} - passed`)
    }
  }
}

process.exit(exit);
