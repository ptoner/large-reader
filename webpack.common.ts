//@ts-nocheck
import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"


import path from 'path'
import webpack from 'webpack'

import { convertFile } from 'convert-svg-to-png'


import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

import { getMainContainer } from "./inversify.config"
import { ChannelWebService } from './src/service/web/channel-web-service'
import { ChannelService } from "./src/service/channel-service"
import { ItemWebService } from "./src/service/web/item-web-service"
import { ItemViewModel } from "./src/dto/viewmodel/item-view-model"
import { ItemRepositoryImpl } from "./src/repository/node/item-repository-impl"
import { StaticPageService } from "./src/service/static-page-service"
import { StaticPageRepositoryImpl } from "./src/repository/node/static-page-repository-impl"
import fs from "fs"
import { ImageService } from "./src/service/image-service"

const VERSION = JSON.stringify(require("./package.json").version)

let configs = []


export default async (hostname, baseURL, largeURL, ipfsCid, marketplaces, maxItems) => {

  let plugins = []

  let container = getMainContainer(baseURL)

  let channelWebService:ChannelWebService = container.get("ChannelWebService")

  let channelService:ChannelService = container.get("ChannelService")
  let itemWebService:ItemWebService = container.get("ItemWebService")
  let staticPageService:StaticPageService = container.get("StaticPageService")
  let imageService:ImageService = container.get("ImageService")

  //Not great to get the impl here. Maybe load should be part of interface. 
  let itemRepository:ItemRepositoryImpl = container.get("ItemRepository")
  await itemRepository.load()

  let staticPageRepository:StaticPageRepositoryImpl = container.get("StaticPageRepository")
  await staticPageRepository.load()

  //Attribute report
  let attributeReport = await channelWebService.buildAttributeReport()

  // console.log(JSON.stringify(attributeReport))
  await fs.promises.writeFile(`public/attributeReport.json`, JSON.stringify(attributeReport))


  //Get channel
  let channel = await channelService.get()
  let channelViewModel = await channelWebService.get(0)
  

  //Get items
  let itemViewModels:ItemViewModel[] = await itemWebService.list(0, maxItems)

  //The list of routable pages to generate.
  let routablePages = await staticPageService.listRoutablePages()





  //Write slideshow to file
  // await fs.promises.writeFile(`public/slideshow.json`, JSON.stringify(await itemWebService.buildSlideshow()))


  //Create plugin to process SVGs to PNG
  class ProcessImagesPlugin {
    // Define `apply` as its prototype method which is supplied with compiler as its argument
    apply(compiler) {
      // Specify the event hook to attach to
      compiler.hooks.emit.tapAsync(
        'ProcessImagesPlugin',
        async (compilation, callback) => {
  
          //Generate PNG previews for any SVG coverImage so that we always can show a Twitter preview
          let images:Image[] = await imageService.list()

          for (let image of images.filter( image => !image.generated)) {
            
            // if (!image.generated) continue 

            let pngPath = `public/images/generatedPNG/${image._id}.png`
            let svgPath = path.resolve(`./backup/images/${image._id}.svg`)

            //Check if there's already a PNG
            if (fs.existsSync(pngPath)) continue

            //Make sure the SVG does exist
            if (!fs.existsSync(svgPath)) continue

            if (!fs.existsSync(`public/images/generatedPNG/`)) {
              await fs.promises.mkdir(`public/images/generatedPNG/`)
            }
            
            let svg = fs.promises.readFile(svgPath)
            // console.log(svgPath)

            console.log(`Creating PNG ${pngPath}`)

            await convertFile(svgPath, {
              outputFilePath: pngPath,
              height: 1200,
              width: 1200
            })

            
          }

          callback();
        }
      );
    }
  }



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
      hostname: hostname,
      largeURL: largeURL,
      marketplaces: marketplaces,
      ipfsCid: ipfsCid,
      firstPost: itemViewModels[0]
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


    //Attribute Report
    plugins.push(
      new HtmlWebpackPlugin({
        inject: false,
        title: channelViewModel.channel.title,
        // favicon: 'src/html/favicon.ico',
        template: 'src/html/pages/attributes.ejs',
        filename: 'attributes.html',
        channelViewModel: channelViewModel,
        attributeReport: attributeReport,
        routablePages: routablePages,
        baseURL: baseURL,
        hostname: hostname,
        largeURL: largeURL
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






  for (let itemViewModel of itemViewModels) {

    plugins.push(

      new HtmlWebpackPlugin({
        inject: false,
        title: itemViewModel.item.title,
        // favicon: 'src/html/favicon.ico',
        template: 'src/html/pages/token.ejs',
        filename: `t/${itemViewModel.item.tokenId}/index.html`,
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
        "crypto": require.resolve("crypto-browserify"),
        "fs": false
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
            { from: './backup', to: 'backup' },
            { from: './node_modules/large-nft/public', to: 'admin' }

        ]
      }),

      // new ProcessImagesPlugin() //too slow right now
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
        VERSION: VERSION,
        BASEURL: JSON.stringify(baseURL),
        HOSTNAME: JSON.stringify(hostname)
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