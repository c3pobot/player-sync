'use strict'
const log = require('logger')
const { calcRosterStats } = require('statcalc')
const swgohClient = require('./swgohClient')
const formatPlayer = require('./formatPlayer')
const { playerCache } = require('valkey-cache')

module.exports = async(opt = {})=>{
  try{
    if(!opt.playerId && !opt.allyCode) return
    if(opt.playerId) delete opt.allyCode
    let player = await swgohClient('player', opt)
    if(!player.rosterUnit) return

    let profile = calcRosterStats(player.rosterUnit)
    if(!profile?.summary) return
    let stats = { zetaCount: profile.summary.zeta, sixModCount: profile.summary.mod.r6, omiCount: profile.summary.omi, roster: profile.roster, summary: profile.summary }
    stats.omiCount.gac = profile.summary.omi.ga
    stats.omiCount.conquest = profile.summary.omi.cq
    player = { ...player,...stats }
    formatPlayer(player)
    if(!player.gp) return
    playerCache.set(player)

    return player
  }catch(e){
    log.error(e)
  }
}
