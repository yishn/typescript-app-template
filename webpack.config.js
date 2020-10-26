const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = relativePath => path.resolve(__dirname, relativePath)

module.exports = (env, argv) => ({
  entry: resolve('./src/ui/main.ts'),

  output: {
    filename: 'bundle.js',
    path: resolve('./build/ui'),
  },

  devtool:
    argv.mode === 'production' ? 'source-map' : 'eval-cheap-module-source-map',

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('./src/ui/index.html'),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: argv.mode !== 'production',
            configFile: resolve('./src/ui/tsconfig.json'),
          },
        },
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
})
