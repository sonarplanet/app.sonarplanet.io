const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const common_webpack = require('./webpack.common.config.js')

module.exports = merge.strategy({
  loader: 'append',
  plugins: 'append'
})(common_webpack, {
  mode: "development",
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
                  to: 'http://wwww.sonarPlanet-services-no-prod.cleverapps.io'
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
