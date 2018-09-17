const Autoprefixer = require('autoprefixer');
const PostCssCssVariables = require('postcss-css-variables');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
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
            presets: [
              ['env', {targets: {safari:10}}],
              'react', 'stage-2'],
            plugins: [
              ['transform-react-jsx', { pragma: 'h' }],
              ['jsx-pragmatic', { module: 'preact', import: 'h', export: 'h' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [Autoprefixer, PostCssCssVariables]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.jsx?$/i,
        parallel: true,
        uglifyOptions: {
          compress: {
            ecma: 6,
            passes: 2,
            unsafe_Function: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
            unsafe_regexp: true
          },
          keep_fnames: false,
          mangle: true,
          output: {
            beautify: false,
          }
        }
      }),
      new OptimizeCssAssetsPlugin({})
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
