import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import axios from "axios"

import { getMainContainer } from "./inversify.config"


//Import CSS
import './html/css/app.css'
import './html/css/framework7-bundle.css'
import './html/css/framework7-icons.css'

import 'material-icons/iconfont/material-icons.css';


export default async() => {
                
    let container = getMainContainer()

    const response = await axios.get(`/backup/initial.json`)

    console.log(response)
    
}
