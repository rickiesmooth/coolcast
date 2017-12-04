const webpack = require('webpack')
const prod = require('./bundles').prod
const clean = require('./clean')
const templates = require('./templates')

const createCompiler = config => {
  const compiler = webpack(config)
  return () => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err)
        console.log(stats.toString({ colors: true }) + '\n')
        resolve()
      })
    })
  }
}

module.exports = async () => {
  console.log('Compiling modern and legacy script bundles...\n')
  const compileModernBundle = createCompiler(prod)

  await compileModernBundle()

  console.log('Compiling templates...\n')
  await templates()

  // Removes any files not in the revisioned asset manifest.
  await clean()

  console.log('Site ready!')
}
