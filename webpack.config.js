const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: {
    client: 'index',
    prerender: 'prerender',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env', 'react', 'stage-2'],
            plugins: [["transform-react-jsx", { "pragma": "h" }]]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  },
  output: {
    publicPath: '/static/'
  },
  plugins: [
    new HtmlWebPackPlugin({
      chunks: ['client'],
      template: "./template/board.html",
      filename: "./templates/board.html"
    }),
    new MiniCssExtractPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve('./src'),
      path.resolve('./vendor'),
      path.resolve('./node_modules'),
      path.resolve('./css')
    ]
  }
};
