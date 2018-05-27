const HtmlWebPackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const configurations = require('./src/properties.json');
const env = process.env.WEBPACK_ENV_MODE;
const configuration = configurations[env];

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const outputPath = 'dist';

module.exports = {
  entry: {
    sonarplanet: ['./src/sonarplanet.ts', './src/styles/sonarplanet.scss'],
    'service-worker': './src/service-worker.ts',
  },
  output: {
    filename: './js/[name]_[hash:5].js',
    path: path.resolve(__dirname, outputPath),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  mode: configuration.mode,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'ts-loader' },
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [{ search: '%%SONAR_BACK_URL%%', replace: configuration.sonarplanetBackendUrl }],
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name]_[hash:5].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
    ],
  },
  plugins: getPlugins(env),
  devServer: configuration.devServer,
};

function getPlugins(env) {
  var commonPlugins = [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      title: 'Sonar Planet',
    }),
  ];

  const faviconplugin = new FaviconsWebpackPlugin({
    logo: './src/images/icon.png',
    prefix: './images/favicons-[hash:5]/',
    inject: true,
    persistentCache: true,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: true,
      opengraph: false,
      twitter: false,
      yandex: false,
      windows: false,
    },
  });
  commonPlugins.push(faviconplugin);

  const faviconCopyPlugin = new FaviconCopyPlugin();
  commonPlugins.push(faviconCopyPlugin);

  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  let uglifyPlugin = new UglifyJsPlugin({
    test: /\.js($|\?)/i,
    sourceMap: true,
  });

  switch (env) {
    case 'development': {
      commonPlugins.concat[
        new UglifyJsPlugin({
          test: /\.js($|\?)/i,
          sourceMap: true,
          uglifyOptions: {
            compress: false,
            mangle: false,
          },
        })
      ];
    }
    case 'integration':
      return commonPlugins.concat([uglifyPlugin]);
    case 'production':
      return commonPlugins.concat([uglifyPlugin]);
  }
  return commonPlugins;
}

function FaviconCopyPlugin() {
  var apply = function apply(compiler) {
    compiler.plugin('after-emit', function(compilation, callback) {
      const SRC_VALUE = 'images/favicons-*/favicon.ico';
      const DEST_VALUE = 'favicon.ico';

      var outputPath = compiler.options.output.path;
      var srcPath = path.join(outputPath, SRC_VALUE);
      srcPath = glob.sync(srcPath)[0];
      var dest = path.join(outputPath, DEST_VALUE);

      fs.createReadStream(srcPath).pipe(fs.createWriteStream(dest));

      callback();
    });
  };

  return {
    apply: apply,
  };
}
