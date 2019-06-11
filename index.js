const pug = require('pug')
const fs = require('fs');
const stylus = require('stylus')

const { pugPath, stylPath, dataPath, outputPath } = require('./config')

async function main() {
  const html = await complie(pugPath, stylPath, dataPath)

  output(outputPath, html)
  console.log("输出完成！")
}

async function complie(pugPath, stylPath, dataPath) {
  const data = require(dataPath)
  const pugStr = readString(pugPath)
  const stylStr = readString(stylPath)
  const __style = await stylus2CssAsync(stylStr)
  const html = pug.render(pugStr, { ...data, __style })

  return html
}

function output(path, data) {
  delDir(path)
  fs.mkdirSync(path)
  fs.writeFileSync(`${path}/index.html`, data)
}

function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

function readString(path) {
  return fs.readFileSync(path).toString()
}

function stylus2CssAsync(stylStr) {
  return new Promise(resolve => stylus.render(stylStr, (err, css) => resolve(css)))
}

main();
