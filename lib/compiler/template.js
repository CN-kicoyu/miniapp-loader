const loaderUtils = require('loader-utils')
const fs = require('fs-extra')
const { resolve } = require('path')
const cons = require('consolidate')
const regeneratorRuntime = require('regenerator-runtime')

const render = (lang, html, opt) => new Promise(resolve => {
  cons[lang]
    .render(html, opt, (err, res) => {
      if (err) throw err
      resolve(res)
    })
})

module.exports = async function (template) {
  this.cacheable && this.cacheable()
  const opt = loaderUtils.getOptions(this) || {}
  const dist = opt.assets || 'dist'
  const folder = loaderUtils.interpolateName(this, `[folder]`, opt)
  const filename = loaderUtils.interpolateName(this, `[name].${opt.htmlExt}`, opt)
  let html = template.content

  if (template.lang) {
    if (!cons[template.lang]) {
      return new Error(
          "Template engine '" +
          template.lang +
          "' " +
          "isn't available in Consolidate.js"
      )
    }

    html = await render(template.lang, template.content, {pretty: true})
  }

  fs.outputFileSync(resolve(process.cwd(), `${dist}/pages/${folder}/${filename}`), html, 'utf8')
}