import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"


import path from 'path'
import webpack from 'webpack'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

import { getMainContainer } from "./inversify.config"
import { ChannelWebService } from './src/service/web/channel-web-service'
import { ChannelService } from "./src/service/channel-service"
import { CHUNK_SIZE } from "./src/repository/item-repository"
import { ItemWebService } from "./src/service/web/item-web-service"
import { ItemViewModel } from "./src/dto/viewmodel/item-view-model"
import { ItemRepositoryImpl } from "./src/repository/node/item-repository-impl"
import { QuillService } from "./src/service/core/quill-service"
import { StaticPageService } from "./src/service/static-page-service"
import { StaticPageRepositoryImpl } from "./src/repository/node/static-page-repository-impl"
import fs from "fs"

const VERSION = JSON.stringify(require("./package.json").version)

let configs = []




export default async (hostname, baseURL) => {

  let plugins = []

  let container = getMainContainer()

  let channelWebService:ChannelWebService = container.get("ChannelWebService")

  let channelService:ChannelService = container.get("ChannelService")
  let itemWebService:ItemWebService = container.get("ItemWebService")
  let staticPageService:StaticPageService = container.get("StaticPageService")

  //Not great to get the impl here. Maybe load should be part of interface. 
  let itemRepository:ItemRepositoryImpl = container.get("ItemRepository")
  await itemRepository.load()

  let staticPageRepository:StaticPageRepositoryImpl = container.get("StaticPageRepository")
  await staticPageRepository.load()


  //Get channel
  let channel = await channelService.get()
  let channelViewModel = await channelWebService.get(0)
  



  //The list of routable pages to generate.
  let routablePages = await staticPageService.listRoutablePages()

  //Attribute report
  let attributeReport = await channelWebService.getAttributeReport()

  //Write slideshow to file
  await fs.promises.writeFile(`public/slideshow.json`, JSON.stringify(await itemWebService.buildSlideshow()))


  //Build home page
  plugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      title: channelViewModel.channel.title,
      // favicon: 'src/html/favicon.ico',
      template: 'src/html/index.ejs',
      filename: 'index.html',
      channelViewModel: channelViewModel,
      attributeReport: attributeReport,
      routablePages: routablePages,
      baseURL: baseURL,
      hostname: hostname
    })
  )

  //Mint page
  plugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      title: channelViewModel.channel.title,
      // favicon: 'src/html/favicon.ico',
      template: 'src/html/mint.ejs',
      filename: 'mint.html',
      channelViewModel: channelViewModel,
      routablePages: routablePages,
      baseURL: baseURL,
      hostname: hostname
    })
  )

  //Search page
  plugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      title: channelViewModel.channel.title,
      // favicon: 'src/html/favicon.ico',
      template: 'src/html/search.ejs',
      filename: 'search.html',
      channelViewModel: channelViewModel,
      routablePages: routablePages,
      baseURL: baseURL,
      hostname: hostname
    })
  )


  //explore page
  let itemPages = await itemWebService.buildItemPages(0, 100000, 35)


  //Write these to files
  let count=0

  await fs.promises.mkdir('public/itemPages', { recursive: true })

  for (let itemPage of itemPages) {
    await fs.promises.writeFile(`public/itemPages/${count}.json`, JSON.stringify(itemPage))
    count++
  }



  plugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      title: channelViewModel.channel.title,
      // favicon: 'src/html/favicon.ico',
      template: 'src/html/pages/explore.ejs',
      filename: 'explore.html',
      channelViewModel: channelViewModel,
      routablePages: routablePages,
      firstItemPage: itemPages[0],
      baseURL: baseURL,
      hostname: hostname
    })
  )

  //Build static pages
  if (channelViewModel.staticPagesViewModel?.links?.length > 0) {

    for (let staticPage of channelViewModel.staticPagesViewModel?.links) {

      plugins.push(
        new HtmlWebpackPlugin({
          inject: false,
          title: channelViewModel.channel.title,
          // favicon: 'src/html/favicon.ico',
          template: 'src/html/pages/static-page.ejs',
          filename: `${staticPage.slug}.html`,
          channelViewModel: channelViewModel,
          routablePages: routablePages,
          staticPage: staticPage,
          baseURL: baseURL,
          hostname: hostname
        })
      )

    }


  }


  // //Build individual item pages
  let itemViewModels:ItemViewModel[] = await itemWebService.list(0, 100000)
  // let itemViewModels:ItemViewModel[] = await itemWebService.list(0, 35)



  for (let itemViewModel of itemViewModels) {

    plugins.push(

      new HtmlWebpackPlugin({
        inject: false,
        title: itemViewModel.item.title,
        // favicon: 'src/html/favicon.ico',
        template: 'src/html/pages/item-show.ejs',
        filename: `item-show-${itemViewModel.item._id}.html`,
        itemViewModel: itemViewModel,
        routablePages: routablePages,
        baseURL: baseURL,
        hostname: hostname
      })
    
    )
  }



  //404 page
  plugins.push(new HtmlWebpackPlugin({
    inject: false,
    title: channel.title,
    // favicon: 'src/html/favicon.ico',
    template: 'src/html/404.ejs',
    filename: `404.html`,
    baseURL: baseURL,
    hostname: hostname
  }))

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: false,
      presets: [
        [
          "@babel/preset-env", {
            "targets": {
              "node": "current"
            }
          }
        ]
      ]
    }
  }
  

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
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
      alias: {
        buffer: 'buffer',
        process: 'process/browser.js'
      },
      fallback: { 
        "path": require.resolve("path-browserify"),
        "util": require.resolve("util/"),
        "assert": require.resolve("assert/"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify")
      }
    },
    output: {
      filename: 'js/[name].reader.js',
      library: "reader",
      path: path.resolve(__dirname, 'public')
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
          },
  
        }
      }
    },
    plugins: [
  
      new CleanWebpackPlugin({
        dangerouslyAllowCleanPatternsOutsideProject: true
      }),
  
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
      }),
  
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
  
      new webpack.ProvidePlugin({
        fetch: ['node-fetch', 'default'],
      }),

      new webpack.DefinePlugin({
        VERSION: VERSION
      }),

      ...plugins,
  
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
  
      new HTMLInlineCSSWebpackPlugin(),
  
  
      new CopyWebpackPlugin({
        patterns: [
            { from: './backup', to: 'backup' }
        ]
      })
    ]
  }


  let swFilename = `sw-${VERSION.replace('"', '').replace('"', '')}.js`

  let serviceWorkerConfig = {
    entry: './src/sw.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: '/node_modules/',
          loader: 'ts-loader',
        }
      ],
    },
    output: {
      filename: swFilename,
      path: path.resolve(__dirname, 'public')
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: VERSION
      })
    ]
  }

  
  configs.push(serviceWorkerConfig)
  configs.push(readerConfig)

  return configs
}








  //Build pages for navigation
  // for (let i=0; i < pages; i++) {

  //   let channelViewModel = await channelWebService.get(i * CHUNK_SIZE)

  //   plugins.push(

  //     new HtmlWebpackPlugin({
  //       inject: false,
  //       title: channelViewModel.channel.title,
  //       // favicon: 'src/html/favicon.ico',
  //       template: 'src/html/pages/list.ejs',
  //       filename: `list-${i+1}.html`,
  //       channelViewModel: channelViewModel,
  //       routablePages: routablePages,
  //       baseURL: baseURL,
  //       hostname: hostname
  //     })
    
  //   )
  // }