import { merge } from 'webpack-merge'
import path from 'path'
import common from './webpack.common'

let mainConfigs = []

let hostname = "http://localhost:8081"
let baseURL = "/"
let largeURL = "http://localhost:9081"
let ipfsCid = "QmTQy7nCSMAksjTNcRryPcWaygZvj3FevQkrJAUoCYYS7z"

let config:any = require("./large-config.json")

export default async () => {

    let configs = await common(hostname, baseURL, largeURL, ipfsCid, config.marketplaces)

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
