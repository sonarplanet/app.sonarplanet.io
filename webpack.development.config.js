const merge = require('webpack-merge')
const common_webpack = require('./webpack.common.config.js')

module.exports = merge.strategy({
  loader: 'append'
})(common_webpack, {
  mode: "development",
  devServer: {
    contentBase: "dist",
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'webpack-replace',
            query: {
              replace: [
                {
                  from: '%%SONAR_BACK_URL%%',
                  to: 'http://localhost:8080'
                }
              ]
            }
          }
        ]
      }
    ]
  }
})
