const loaderUtils = require('loader-utils')
const fs = require('fs-extra')
const { resolve } = require('path')

module.exports = function (script) {
  this.cacheable && this.cacheable()
  const callback = this.async()

  const opt = loaderUtils.getOptions(this) || {}
  const dist = opt.assets || 'dist'
  const jsExt = opt.jsExt || 'js'
  const folder = loaderUtils.interpolateName(this, `[folder]`, opt)
  const filename = loaderUtils.interpolateName(this, `[name].${jsExt}`, opt)

  let js = script ? script.content.replace(/\/\/\n+/g, '') : 'Page({})'
  fs.outputFileSync(resolve(process.cwd(), `${dist}/pages/${folder}/${filename}`), js, 'utf8')
  
  callback(null, '')
}