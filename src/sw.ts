
//@ts-nocheck
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom')

// console.log(VERSION)

const DEBUG = true
const RUNTIME = 'runtime'

let parser = new DOMParser()

const getBaseURL = () => {

    let pathSplit = self.location.pathname.split("/")

    pathSplit.pop() //remove last

    let basepath = pathSplit.join("/") 

    return basepath 
}

let baseURL = getBaseURL()

console.log(`[SW] Base Path: ${baseURL}`)

// When the service worker is first added to a computer.
self.addEventListener('install', event => {

    // Perform install steps.
    if (DEBUG) {
        console.log('[SW] Install event!!')
    }

    event.waitUntil(self.skipWaiting())

})

// After the install event.
self.addEventListener('activate', event => {
    if (DEBUG) {
        console.log('[SW] Activate event')
    }

    event.waitUntil(self.clients.claim())

})


self.addEventListener('fetch', event => {
  
    const request = event.request
    // console.log(request)
    // Ignore not GET request.
    if (request.method !== 'GET') {
        if (DEBUG) {
            console.log(`[SW] Ignore non GET request ${request.method}`)
        }
        return
    }

    const requestUrl = new URL(request.url)

    // Ignore difference origin.
    if (requestUrl.origin !== location.origin) {
        if (DEBUG) {
            console.log(`[SW] Ignore difference origin ${requestUrl.origin}`)
        }
        return
    }

    const url = new URL(event.request.url)


    let process = false


    //Skip backup folder
    if (url.pathname.startsWith(`${baseURL}/list`)) process = true
    if (url.pathname.startsWith(`${baseURL}/item-show`)) process = true
    if (url.pathname.startsWith(`${baseURL}/index.html`)) process = true

    // This is a navigation request, so respond with a complete HTML document.
    if (event.request.mode === 'navigate') process = false 

    if (DEBUG) {
        console.log(`[SW] Process URL ${url.pathname}: ${process} / Mode: ${event.request.mode}`)
    }

    if (process) {
        event.respondWith(getResource(request))
    }
    
})


const getResource = async (request:Request) => {

    let response = await fetch(request)

    let updatedResponse = await updateResponse(response)

    return updatedResponse

}



const updateResponse = async (response:Response) => {

    let responseText = await response.text()

    let page = parser.parseFromString(responseText, 'text/html')
    let pageElement = page.getElementsByClassName('page')[0]

    let script = page.getElementById('page-init-scripts')

    let content = new XMLSerializer().serializeToString(pageElement)

    //Execute it. Will put init in globalThis.pageInit
    let f = new Function(script.textContent)
    f()

    //Remove parameters because they will already exist in scope
    let code = globalThis.pageInit.toString().replace(/\((.*?)\)/, '()')

    let component = `
        <template>
            ${content}
        </template>

        <script>
            export default (props, { $, $f7, $h, $on, $update }) => {  
                
                let baseURL = '${baseURL}'

                let init = ${code}

                init(props)

                return $render;
            }
        </script>
    `

    return new Response(component, response)



}



