import log from './logger.js'
const SWGOH_CLIENT_URL = process.env.SWGOH_CLIENT_URL || 'http://swgoh-client:3000'

let retryCount = +process.env.CLIENT_RETRY_COUNT || 6

async function parseResponse(r){
  let contentType = r?.headers.get("content-type")
  if(contentType && contentType?.indexOf("application/json") !== -1) return await r?.json()
}

async function requestWithRetry(url, opts, count = 0){
  try{
    opts.signal = AbortSignal.timeout(30000)
    let r = await fetch(url, opts)
    count++
    let res = await parseResponse(r)
    if(!r.ok && !res?.code && count < retryCount) return await requestWithRetry(url, opts, count)
    if(!r.ok && res?.code && count < retryCount){
      if(res?.code == 6 || !reAuthCodes[res.code]) return await requestWithRetry(url, opts, count)
    }
    if(!r.ok) return
    return res
  }catch(e){
    log.error(e)
  }
}

export default async function(uri, payload, method = 'POST'){
  try{
    let opts = { compress: true, method: method }

    if(payload){
      let body = {}
      if(payload) body.payload = payload
      opts.body = JSON.stringify(body)
      opts.headers = { 'Content-Type': 'application/json'}
    }
    return await requestWithRetry(`${SWGOH_CLIENT_URL}/${uri}`, opts, 0)
  }catch(e){
    log.error(e)
  }
}
