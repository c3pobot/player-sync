import log from './logger.js'
import cache from './cache.js'
import swgohClient from './swgoh_client.js'
import gameData from './game_data.js'
import sync from './sync/index.js'

async function checkClient(){
  try{
    let obj = await swgohClient('metadata')
    if(obj?.latestGamedataVersion){
      log.info(`game client ready...`)
      return checkCache()
    }
    setTimeout(checkClient, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkClient, 5000)
  }
}
async function checkCache(){
  try{
    if(cache.status()){
      log.info('cache is ready')
      return checkGameData()
    }
    setTimeout(checkCache, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkCache, 5000)
  }
}
function checkGameData(){
  try{
    if(gameData.status()){
      log.info('gamedata is ready')
      return sync.start()
    }
    setTimeout(checkGameData, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkGameData, 5000)
  }
}
checkClient()
