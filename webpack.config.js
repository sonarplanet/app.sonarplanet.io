const HtmlWebPackPlugin = require("html-webpack-plugin")

const configurations = require('./src/properties.json')
const env = process.env.WEBPACK_ENV_MOVE
const configuration = configurations[env]

module.exports = {
  entry: {
    sonarplanet: ['./src/sonarplanet.ts', './src/styles/sonarplanet.scss'],
    'service-worker': './src/service-worker.ts'
  },
  output: {
    filename: './js/[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  mode: configuration.mode,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [
          /node_modules/
        ],
        use: [
          { loader: "ts-loader" },
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                { search: '%%SONAR_BACK_URL%%', replace: configuration.sonarplanetBackendUrl }
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'responsive-loader',
        options: {
          adapter: require('responsive-loader/sharp'),
          name: "images/[name].[ext]"
        }
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        },
        {
          loader: "css-loader", // translates CSS into CommonJS
        },
        {
          loader: "sass-loader", // compiles Sass to CSS
        }]
      }
    ]
  },
  plugins: getPlugins(env),
  devServer: configuration.devServer
}


function getPlugins(env) {
  var commonPlugins = [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      favicon: "./src/images/favicon.ico",
      title: "Sonar Planet"
    })
  ]

  const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
  let uglifyPlugin = new UglifyJsPlugin({
    test: /\.js($|\?)/i,
    sourceMap: true
  })

  switch (env) {
    case 'integration':
      return commonPlugins.concat([uglifyPlugin])
    case 'production':
      return commonPlugins.concat([uglifyPlugin])
  }
  return commonPlugins
}
