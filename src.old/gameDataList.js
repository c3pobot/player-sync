'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const statCalc = require('statcalc');

let statCalcReady, gameVersion
const updateGameData = async()=>{
  let obj = (await mongo.find('botSettings', {_id: 'gameData'}))[0]
  if(!obj?.data || !obj?.version) return
  if(gameVersion === obj.version) return
  let status = statCalc.setGameData(obj.data)
  if(status){
    statCalcReady = true
    log.info(`gameData set to ${obj?.version}`)
    gameVersion = obj.version
    return true
  }
}
const update = async()=>{
  try{
    let syncTime = 30
    let status = mongo.status()
    if(!status) syncTime = 5
    if(status) await updateGameData()
    setTimeout(()=>update(), syncTime * 1000)
  }catch(e){
    log.error(e)
    setTimeout(()=>update(), 5000)
  }
}
update()
module.exports.update = updateGameData
module.exports.status = ()=>{
  return statCalcReady
}
