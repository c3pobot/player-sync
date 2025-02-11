'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const swgohClient = require('./swgohClient')
const getPlayers = require('./getPlayers')
const formatGuild = require('./formatGuild')

module.exports = async( guildId )=>{
  try{
    if(!guildId) return
    let timeStart = Date.now()
    let guild = await swgohClient('guild', { guildId: guildId, includeRecentGuildActivityInfo: true })
    guild = guild?.guild
    if(!guild?.member) return
    guild.member = guild.member.filter(x=>x.memberLevel > 1)
    let members = await getPlayers(guild.member)
    let timeEnd = Date.now()
    //log.info(`guild pull took ${(timeEnd - timeStart) / 1000} seconds`)
    if(guild?.member?.length !== members?.length) return
    formatGuild(guild, members)
    if(!guild.gp) return
    await mongo.set('guildCache', { _id: guildId }, guild)
    log.debug(`guild pull took ${(timeEnd - timeStart) / 1000} seconds`)
  }catch(e){
    log.error(e)
  }
}
