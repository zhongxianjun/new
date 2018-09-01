const path = require('path')
const fs = require('fs')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const env = process.env.NODE_ENV || 'development'
fs.writeFileSync(path.join(__dirname, './config/env.js'), `export default '${env}'`)


module.exports = {
  
  baseUrl: '',
  
  css: {
    sourceMap: true
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  
  productionSourceMap: false
}
