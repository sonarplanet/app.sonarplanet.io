const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const common_webpack = require('./webpack.common.config.js')

module.exports = merge.strategy({
  loader: 'append',
  plugins: 'append'
})(common_webpack, {
  mode: "production",
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
                  to: 'https://sonarplanet-services-noprod.cleverapps.io'
                }
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      test: /\.js($|\?)/i,
      sourceMap: true
    })
  ]
})
