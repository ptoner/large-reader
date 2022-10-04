const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

import configs from './webpack.common'

import { merge } from 'webpack-merge'

configs[0].plugins.push(new BundleAnalyzerPlugin())

let config = merge(configs[0], {
    //@ts-ignore
    mode: 'production'
})


module.exports = config
