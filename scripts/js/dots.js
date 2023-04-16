// @ts-check
// Usage: node dots.js [command] [options]
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const USER_HOME =
  process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];

const CONFIGS = {
  git: {
    fileName: ".gitconfig",
    src: "../../configs/git/",
    dst: `${USER_HOME}/`,
  },
  zsh: {
    fileName: ".zshrc",
    src: "../../configs/zsh/",
    dst: `${USER_HOME}/`,
  },
  vim: {
    fileName: ".vimrc",
    src: "../../configs/vim/",
    dst: `${USER_HOME}/`,
  },
};

yargs
  .command(
    "deploy <name>",
    "Deploy the config",
    (yargs) => {
      yargs.positional("name", {
        describe: "application name",
        type: "string",
      });
    },
    (argv) => {
      const { src, dst, fileName } = CONFIGS[argv.name];
      const srcPath = path.resolve(__dirname, src, fileName);
      const dstPath = path.resolve(dst, fileName);
      // 存在チェック
      if (fs.existsSync(srcPath) && !fs.existsSync(dstPath)) {
        // 存在しない場合はシンボリックリンクを作成
        fs.symlinkSync(srcPath, dstPath);

        console.log(`${argv.name} config deployed!`);
        console.log(`filePath: ${dstPath}`);
      } else {
        // 存在する場合は何もしない
        console.log(`The ${fileName} is already exists`);
        console.log(``);
        console.log(`filePath: ${dstPath}`);
      }
    }
  )
  .command(
    "remove <name>",
    "Remove the config",
    (yargs) => {
      yargs.positional("name", {
        describe: "application name",
        type: "string",
      });
    },
    (argv) => {
      const { dst, fileName } = CONFIGS[argv.name];

      // 存在チェック
      const filePath = path.resolve(dst, fileName);

      if (fs.existsSync(filePath)) {
        // 存在する場合は削除
        fs.unlinkSync(filePath);
        console.log(`${argv.name} config removed!`);
        console.log(`filePath: ${filePath}`);
      } else {
        // 存在しない場合は何もしない
        console.log(`${fileName} does not exists`);
        console.log(``);
        console.log(`filePath: ${filePath}`);
      }
    }
  )
  .command(
    "status <name>",
    "check the config",
    (yargs) => {
      yargs.positional("name", {
        describe: "application name",
        type: "string",
      });
    },
    (argv) => {
      const { dst, fileName } = CONFIGS[argv.name];

      // 設定ファイルが存在するかをチェック
      const filePath = path.resolve(dst, fileName);
      if (fs.existsSync(filePath)) {
        console.log(`${fileName} is exists`);
        console.log(``);
        console.log(`filePath: ${filePath}`);
      } else {
        console.log(`${fileName} does not exist`);
        console.log(``);
        console.log(`filePath: ${filePath}`);
      }
    }
  )
  .demandCommand(1, "At least one command is required")
  .strict()
  .parse();

// function deploy() {
//     console.log("deploy")
// }
// function remove()  {
//     console.log("remove")
// }
// function status() {
//     console.log("status")
// }
// function help() {
//     console.log("help")
// }
