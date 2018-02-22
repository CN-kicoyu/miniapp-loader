const loaderUtils = require('loader-utils')
const fs = require('fs-extra')
const { resolve } = require('path')
const regeneratorRuntime = require('regenerator-runtime')

const config = {
  stylus: (file, data) => new Promise(resolve => {
    require('stylus').render(data, { filename: file }, (err, result) => {
      if (err) throw err
      resolve(result.css)
    }) 
  }),
  less: (file, data) => new Promise(resolve => {
    require('less').render(data, {outputStyle: 'expanded'}, (err, result) => {
      if (err) throw err
      resolve(result.css)
    }) 
  }),
  scss: (file, data) => new Promise(resolve => {
    require('node-sass').render({
      file, 
      data,
      outputStyle: 'expanded'
    }, (err, result) => {
      if (err) throw err
      resolve(result.css)
    }) 
  }),
  sass: (file, data) => new Promise(resolve => {
    require('node-sass').render({
      file, 
      data,
      outputStyle: 'expanded',
      indentedSyntax: true
    }, (err, result) => {
      if (err) throw err
      resolve(result.css)
    }) 
  })
}

module.exports = async function (style) {
  this.cacheable && this.cacheable()
  const opt = loaderUtils.getOptions(this) || {}
  const dist = opt.assets || 'dist'
  const filePath = this.resourcePath
  const folder = loaderUtils.interpolateName(this, `[folder]`, opt)
  const filename = loaderUtils.interpolateName(this, `[name].${opt.cssExt}`, opt)
  const lang = style.lang

  let stylesheet = style.content.replace(/\n\n+/g, '')
  if (lang) {
    const render = config[style.lang]
    stylesheet = await render(filePath, stylesheet)
  }
  fs.outputFileSync(resolve(process.cwd(), `${dist}/pages/${folder}/${filename}`), stylesheet)
}
