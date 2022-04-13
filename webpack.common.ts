import path from 'path'
import webpack from 'webpack'


import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const nodeExternals = require('webpack-node-externals')

// const exec = require('child_process').exec;
const channels = require(`./backup/channels.json`)

let title = channels[0].title

const fileLoader = {
  loader: 'file-loader',
  options: {
    name: '[folder]/[name].[ext]'
  }
}

let readerConfig = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot)$/,
        use: [fileLoader],
      },
      
      {
        test: /\.(ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[folder]/[name]'
          }
        },
      },
      {
        test: /\.f7.html$/,
        use: ['framework7-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
    },
    fallback: { 
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "stream": require.resolve("stream-browserify"),
    }
  },
  output: {
    filename: '[name].reader.js',
    library: "reader",
    path: path.resolve(__dirname, 'public'),
    clean: true
  },
  optimization: {
    usedExports: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [

    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),

    //Admin index page
    new HtmlWebpackPlugin({
      inject: false,
      title: title,
      // favicon: 'src/html/favicon.ico',
      template: 'src/html/index.html',
      filename: 'index.html'
    }),

    new CopyWebpackPlugin({
      patterns: [
          { from: './backup', to: 'backup' }
      ]
    })
  ]
}


export default [readerConfig]