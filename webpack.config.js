const HtmlWebPackPlugin = require("html-webpack-plugin")
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

module.exports = (env) => ({
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
  mode: env || 'development',
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader"
        }
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
          options: {
            sourceMap: true
          }
        },
        {
          loader: "sass-loader", // compiles Sass to CSS
          options: {
            sourceMap: true
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      favicon: "./src/images/favicon.ico",
      title: "Sonar Planet"
    })
  ]

})
