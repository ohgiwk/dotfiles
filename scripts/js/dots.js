// @ts-check
// Usage: node dots.js [command] [options]
const fs = require("fs")
const path = require("path")
const yargs = require("yargs")
const USER_HOME =
  process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]

/**
 * 設定ファイルをデプロイする
 * @param {string} name
 */
function deploy(name, settings) {
  const configs = settings[name]

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
      }))

    // 存在チェック
    // コピー元が存在し、コピー先が存在しない場合はtrue
    if (files.every(({ srcExists, dstExists }) => srcExists && !dstExists)) {
      // 存在しない場合はシンボリックリンクを作成
      files.forEach(({ srcPath, dstPath }) => {
        fs.symlinkSync(srcPath, dstPath)
      })

      console.log(`${name} config deployed!`)
      files.forEach(({ dstPath }) => {
        console.log(`filePath: ${dstPath}`)
      })
    } else {
      files.map(({ fileName, srcExists, srcPath, dstExists, dstPath }) => {
        // コピー元ファイルが存在しない場合はエラーを出力
        if (!srcExists) {
          console.log(`The ${fileName} does not exists`)
          console.log(`filePath: ${srcPath}`)
        }
        // コピー先ファイルが存在する場合はエラーを出力
        if (dstExists) {
          console.log(`The ${fileName} is already exists`)
          console.log(`filePath: ${dstPath}`)
        }
      })
    }
  })
}
/**
 * 設定ファイルを削除する
 * @param {string} name
 */
function remove(name, settings) {
  const configs = settings[name]
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
      }))

    // 全ての設定ファイルが存在するかをチェック
    if (files.every(({ dstExists }) => dstExists)) {
      // 存在する場合は削除
      files.forEach(({ dstPath }) => {
        fs.unlinkSync(dstPath)
      })

      console.log(`${name} config removed!`)
      files.forEach(({ dstPath }) => {
        console.log(`filePath: ${dstPath}`)
      })
    } else {
      // 存在しない場合は何もしない
      files.forEach(({ fileName, dstExists, dstPath }) => {
        if (!dstExists) {
          console.log(`${fileName} does not exists`)
          console.log(``)
          console.log(`filePath: ${dstPath}`)
        }
      })
    }
  })
}
/**
 * 設定ファイルの状態を確認する
 * @param {string} name
 */
function status(name, settings) {
  const configs = settings[name]
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
      }))

    files.forEach(({ fileName, dstExists, dstPath }) => {
      if (dstExists) {
        console.log(`${fileName} is exists`)
      } else {
        console.log(`${fileName} does not exist`)
      }
      console.log(`filePath: ${dstPath}`)
      console.log(``)
    })
  })
}

function backup(name, settings) {
  const configs = settings[name]
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
      }))

    // ファイルが全て存在したら
    if (files.every(({ dstExists }) => dstExists)) {
      // .dots/backupフォルダの下にフォルダを作成
      if (!fs.existsSync(`${USER_HOME}/.dots/backup/${name}`)) {
        fs.mkdirSync(`${USER_HOME}/.dots/backup/${name}`, {
          recursive: true,
        })
      }

      // ファイルをコピー
      files.forEach(({ fileName, dstPath }) => {
        fs.copyFileSync(
          dstPath,
          `${USER_HOME}/.dots/backup/${name}/${fileName}`
        )
        // ログを出力
        console.log(`${fileName} is backuped`)
      })
    } else {
      files.forEach(({ fileName, dstExists, dstPath }) => {
        if (!dstExists) {
          console.log(`${fileName} does not exists`)
          console.log(`filePath: ${dstPath}`)
        }
      })
    }
  })
}

function getSettings() {
  const setting_path = path.resolve(__dirname, "../../settings.json")
  const settings = require(setting_path)

  Object.keys(settings).forEach((key) => {
    Object.entries(settings[key]).forEach(([key2, value]) => {
      settings[key][key2] + value.replace("~", USER_HOME)
    })
  })

  return settings
}

yargs
  .command(
    "deploy <name>",
    "Deploy the config",
    (yargs) => {
      yargs.positional("name", {
        describe: "application name",
        type: "string",
      })
    },
    (argv) => {
      const settings = getSettings()
      // @ts-ignore
      deploy(argv.name, settings)
    }
  )
  .command(
    "remove <name>",
    "Remove the config",
    (yargs) => {
      yargs.positional("name", {
        describe: "application name",
        type: "string",
      })
    },
    (argv) => {
      const settings = getSettings()
      // @ts-ignore
      remove(argv.name, settings)
    }
  )
  .command(
    "status <name>",
    "check the config",
    (yargs) => {
      yargs.positional("name", {
        describe: "application name",
        type: "string",
      })
    },
    (argv) => {
      const settings = getSettings()
      // @ts-ignore
      status(argv.name, settings)
    }
  )
  // backup
  .command(
    "backup <name>",
    "backup the config",
    (yargs) => {
      yargs.positional("name", {
        describe: "application name",
        type: "string",
      })
    },
    (argv) => {
      const settings = getSettings()
      // @ts-ignore
      backup(argv.name, settings)
    }
  )

  .demandCommand(1, "At least one command is required")
  .strict()
  .parse()
