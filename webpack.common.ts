//@ts-nocheck
import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import webpack from "webpack"
import fs from "fs"
import path from "path"

import PouchDB from 'pouchdb-node';

// import { getMainContainer } from "./inversify.config"

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

import {
  WebPackConfig, getMainContainer
} from "large-reader-services/dist/node"
import { Container } from "inversify"

import { convert } from "convert-svg-to-png"

const VERSION = JSON.stringify(require("./package.json").version)


export default async (hostname, baseURL, marketplaces, maxItems) => {

  let container = new Container()

  container.bind("PouchDB").toConstantValue(PouchDB)

  container = getMainContainer(container, baseURL)


  return WebPackConfig(
    webpack, 
    require,
    fs,
    path,
    convert,
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
