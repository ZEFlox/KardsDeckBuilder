const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineSourcePlugin = require('inline-source-plugin')

module.exports = {
  entry: './dist/main.js',
  plugins: [
    new HtmlWebpackPlugin({
      template: './dist/index.html',
    }),
    new InlineSourcePlugin({
      compress: true,
      rootpath: './dist',
      test: /\.(js|css)$/,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg)$/,
        type: 'asset/inline', // 自动转Base64
      },
    ],
  },
}
