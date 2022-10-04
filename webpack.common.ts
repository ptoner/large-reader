//@ts-nocheck
import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import webpack from "webpack"
import fs from "fs"
import path from "path"

import { getMainContainer } from "./inversify.config"

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default
import { convertFile } from 'convert-svg-to-png'

import {
  WebPackConfig
} from "large-reader-services/dist/node"

const VERSION = JSON.stringify(require("./package.json").version)


export default async (hostname, baseURL, marketplaces, maxItems) => {

  let container = getMainContainer(baseURL)

  return WebPackConfig(
    webpack, 
    require,
    fs,
    path,
    convertFile,
    HtmlWebpackPlugin, 
    CleanWebpackPlugin, 
    CopyWebpackPlugin,
    MiniCssExtractPlugin,
    HTMLInlineCSSWebpackPlugin,
    container, 
    VERSION, 
    __dirname,
    hostname, 
    baseURL, 
    marketplaces, 
    maxItems)
}
