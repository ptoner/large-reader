import { merge } from 'webpack-merge'
import common from './webpack.common'

let mainConfigs = []

export default async () => {

    let configs = await common("https://localhost:8081", "/alice-s-adventures-in-wonderland-reader/")

    for (let config of configs) {
        //@ts-ignore
        mainConfigs.push(merge(config, {
            //@ts-ignore
            mode: 'production'
        }))
    }
    
    return mainConfigs

}
