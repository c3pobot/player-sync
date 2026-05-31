import log from './logger.js'
import { swgohCache } from './cache.js'
import statCalc from 'statcalc'
let game_data_ready, game_version

async function updateGameData(){
  try{
    let obj = await swgohCache.get('botSettings', { _id: 'gameData' })
    if(!obj?.data || !obj?.version) return
    if(game_version == obj.version) return
    let status = statCalc.setGameData(obj.data)
    if(status){
      game_data_ready = true, game_version = obj.version
      log.info(`gameData set to ${game_version}`)
      return true
    }
  }catch(e){
    log.error(e)
  }
}
async function sync(){
  try{
    let syncTime = 5
    if(!swgohCache.status()) return setTimeout(sync, 5000)
    let status = await updateGameData()
    if(status) syncTime = 5 * 60
    setTimeout(sync, syncTime * 1000)
  }catch(e){
    log.error(e)
    setTimeout(sync, 5000)
  }
}
sync()
export default { update: updateGameData, status: ()=>{ return game_data_ready } }
