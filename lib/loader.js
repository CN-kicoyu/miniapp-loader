const path = require('path')
const hash = require('hash-sum')
const loaderUtils = require('loader-utils')
const parse = require('./lib/utils/parser')
const templateCompiler = require('./lib/compiler/template')
const scriptCompiler = require('./lib/compiler/script')
const styleCompiler = require('./lib/compiler/style')

module.exports = function (content) {
  this.cacheable()
  const loaderContext = this
  const query = loaderUtils.getOptions(this) || {}
  const options = Object.assign(
    {
      esModule: true
    },
    query
  )
  if (options.extra) {
    options.esModule = false
  }
  const filePath = this.resourcePath
  const fileName = path.basename(filePath)
  const context = 
    (this._compiler && this._compiler.context) ||
    this.options. context ||
    process.cwd()
  const sourceRoot = path.dirname(path.relative(context, filePath))

  const parts = parse(
    content,
    fileName,
    sourceRoot
  )
  if (parts.template) {
    templateCompiler.call(this, parts.template)  
  }
  if (parts.styles && parts.styles.length) {
    styleCompiler.call(this, parts.styles[0])  
  }
  if (parts.script) {
    scriptCompiler.call(this, parts.script)
  }
   return content
}
