'use strict'
const mongo = require('mongoclient')
const log = require('logger')
const swgohClient = require('./swgohClient')
const gameDataList = require('./gameDataList')
const getGuild = require('./getGuild')

const checkMongo = ()=>{
  log.info(`start up mongo check...`)
  let status = mongo.status()
  if(status){
    checkAPIReady()
    return
  }
  setTimeout(checkMongo, 5000)
}
const checkAPIReady = async()=>{
  try{
    let obj = await swgohClient('metadata')
    if(obj?.latestGamedataVersion){
      log.info('API is ready ..')
      checkGameData()
      return
    }
    log.info('API is not ready. Will try again in 5 seconds')
    setTimeout(checkAPIReady, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkAPIReady, 5000)
  }
}
const checkGameData = async()=>{
  try{
    let status = gameDataList.status()
    if(status){
      sync()
      return
    }
    setTimeout(checkGameData, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkGameData, 5000)
  }
}
const sync = async()=>{
  try{
    await getGuilds()
    setTimeout(sync, 5000)
  }catch(e){
    log.error(e)
    setTimeout(sync, 5000)
  }
}
const getGuilds = async()=>{
  try{
    let guilds = await mongo.find('guilds', { sync: 1 }, { _id: 1, sync: 1})
    if(!guilds || guilds?.length === 0) return
    for(let i in guilds) await getGuild(guilds[i]._id)
  }catch(e){
    log.error(e)
  }
}
checkMongo()
