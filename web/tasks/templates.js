const fs = require('fs-extra')
const nunjucks = require('nunjucks')
const path = require('path')
const config = require('./config.json')

let revisionedAssetManifest = {}

const env = nunjucks.configure('web/templates', {
  autoescape: false,
  watch: false
})

env.addFilter('revision', filename => revisionedAssetManifest[filename])

module.exports = async () => {
  revisionedAssetManifest =
    (await fs.readJson(
      path.resolve('web', config.publicDir, config.manifestFileName),
      {
        throws: false
      }
    )) || {}

  await fs.outputFile(
    path.resolve('web', config.publicDir, 'index.html'),
    nunjucks.render('index.html')
  )

  console.log('Built template: index.html\n')
}
