const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const sveltePreprocess = require('svelte-preprocess');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

console.log(`MODE ${mode}, API_BASE ${process.env.API_BASE}`);

module.exports = {
  entry: ['./src/main.js'],
  resolve: {
    alias: {
      svelte: path.dirname(require.resolve('svelte/package.json')),
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[id].js',
    clean: true,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              dev: !prod,
            },
            emitCss: prod,
            hotReload: !prod,
            preprocess: sveltePreprocess({ sourceMap: !prod }),
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        // required to prevent errors from Svelte on Webpack 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  mode,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // Set defaults
    new EnvironmentPlugin({
      NODE_ENV: mode,
      API_BASE: 'http://localhost:8080',
      WS_BASE: 'ws://localhost:8080',
    }),
    new CopyPlugin({
      patterns: [{ from: 'public/img', to: 'img' }, { from: 'public/favicon.ico' }],
    }),
  ],
  devtool: prod ? false : 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    port: 3000,
  },
};
