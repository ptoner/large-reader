import { merge } from 'webpack-merge'
import path from 'path'
import common from './webpack.common'

let mainConfigs = []

let hostname = "http://localhost:8081"
let baseURL = "/"


let baseConfig:any = require("./node_modules/large-reader-services/base-config.json")
let config:any = require("./large-config.json")


//Create marketplace config from base config + anything set in large-config
if (config.marketplaces?.length > 0) {
    for (let marketplace of config.marketplaces) {

        //Look it up in base config
        let matches = baseConfig.marketplaces.filter(m => m.name == marketplace.name)
    
        if (matches?.length > 0) {
        
            //Set asset link
            if (!marketplace.assetLink) {
                marketplace.assetLink = matches[0].assetLink
            }
    
            if (!marketplace.link) {
                marketplace.link = matches[0].link
            }
    
        }
    
    }
}

export default async () => {

    let configs = await common(hostname, baseURL, config.marketplaces, 35)

    for (let config of configs) {
        //@ts-ignore
        mainConfigs.push(merge(config, {
            //@ts-ignore
            mode: 'development',
            //@ts-ignore
            devtool: 'source-map',
    
        }))
    }
    
    mainConfigs[0].devServer = {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: false,
        port: 8081
    }
    
    return mainConfigs
}
