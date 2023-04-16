// @ts-check
// Usage: node dots.js [command] [options]
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const USER_HOME =
  process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];

const CONFIGS = {
  test: [
    {
      fileNames: [".testrc", ".testenv"],
      src: "../../configs/test/src",
      dst: "../../configs/test/dst",
    },
    {
      fileNames: [".testprofile"],
      src: "../../configs/test/src",
      dst: "../../configs/test/dst",
    },
  ],
  git: [
    {
      fileNames: [".gitconfig"],
      src: "../../configs/git/",
      dst: `${USER_HOME}/`,
    },
  ],
  zsh: [
    {
      fileNames: [".zshrc", ".zshenv", ".zprofile"],
      src: "../../configs/zsh/",
      dst: `${USER_HOME}/`,
    },
  ],
  vim: [
    {
      fileNames: [".vimrc"],
      src: "../../configs/vim/",
      dst: `${USER_HOME}/`,
    },
  ],
};

/**
 * 設定ファイルをデプロイする
 * @param {string} name
 */
function deploy(name) {
  const configs = CONFIGS[name];

  configs.forEach(({ src, dst, fileNames }) => {
    const files = fileNames
      .map((fileName) => ({
        fileName,
        srcPath: path.resolve(__dirname, src, fileName),
        dstPath: path.resolve(dst, fileName),
      }))
      // 存在チェック
      .map((file) => ({
        ...file,
        srcExists: fs.existsSync(file.srcPath),
        dstExists: fs.existsSync(file.dstPath),
      }));

    // 存在チェック
    // コピー元が存在し、コピー先が存在しない場合はtrue
    if (files.every(({ srcExists, dstExists }) => srcExists && !dstExists)) {
      // 存在しない場合はシンボリックリンクを作成
      files.forEach(({ srcPath, dstPath }) => {
        fs.symlinkSync(srcPath, dstPath);
      });

      console.log(`${name} config deployed!`);
      files.forEach(({ dstPath }) => {
        console.log(`filePath: ${dstPath}`);
      });
    } else {
      files.map(({ fileName, srcExists, srcPath, dstExists, dstPath }) => {
        // コピー元ファイルが存在しない場合はエラーを出力
        if (!srcExists) {
          console.log(`The ${fileName} does not exists`);
          console.log(`filePath: ${srcPath}`);
        }
        // コピー先ファイルが存在する場合はエラーを出力
        if (dstExists) {
          console.log(`The ${fileName} is already exists`);
          console.log(`filePath: ${dstPath}`);
        }
      });
    }
  });
}
/**
 * 設定ファイルを削除する
 * @param {string} name
 */
function remove(name) {
  const configs = CONFIGS[name];
  configs.forEach(({ dst, fileNames }) => {
    const files = fileNames
      .map((fileName) => ({
        fileName,
        dstPath: path.resolve(dst, fileName),
      }))
      // 各ファイルの存在チェック
      .map((file) => ({
        ...file,
        dstExists: fs.existsSync(file.dstPath),
      }));

    // 全ての設定ファイルが存在するかをチェック
    if (files.every(({ dstExists }) => dstExists)) {
      // 存在する場合は削除
      files.forEach(({ dstPath }) => {
        fs.unlinkSync(dstPath);
      });

      console.log(`${name} config removed!`);
      files.forEach(({ dstPath }) => {
        console.log(`filePath: ${dstPath}`);
      });
    } else {
      // 存在しない場合は何もしない
      files.forEach(({ fileName, dstExists, dstPath }) => {
        if (!dstExists) {
          console.log(`${fileName} does not exists`);
          console.log(``);
          console.log(`filePath: ${dstPath}`);
        }
      });
    }
  });
}
/**
 * 設定ファイルの状態を確認する
 * @param {string} name
 */
function status(name) {
  const configs = CONFIGS[name];
  configs.forEach(({ dst, fileNames }) => {
    // 設定ファイルが存在するかをチェック
    const files = fileNames
      .map((fileName) => ({
        fileName,
        dstPath: path.resolve(dst, fileName),
      }))
      // 各ファイルの存在チェック
      .map((file) => ({
        ...file,
        dstExists: fs.existsSync(file.dstPath),
      }));

    files.forEach(({ fileName, dstExists, dstPath }) => {
      if (dstExists) {
        console.log(`${fileName} is exists`);
      } else {
        console.log(`${fileName} does not exist`);
      }
      console.log(`filePath: ${dstPath}`);
      console.log(``);
    });
  });
}

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
      // @ts-ignore
      deploy(argv.name);
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
      // @ts-ignore
      remove(argv.name);
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
      // @ts-ignore
      status(argv.name);
    }
  )
  .demandCommand(1, "At least one command is required")
  .strict()
  .parse();
