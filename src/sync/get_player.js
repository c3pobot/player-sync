import log from '../logger.js'
import swgohClient from '../swgoh_client.js'
import formatPlayer from './format_player.js'
import { calcRosterStats } from 'statcalc'
import { playerCache, playerIdCache, guildIdCache } from '../cache.js'

async function saveGuildId({ allyCode, playerId, guildId, guildName }){
  if(!guildId || !guildName) return
  await guildIdCache.set(playerId, { playerId, allyCode: allyCode?.toString(), guildId, guildName })
}

async function savePlayer(obj){
  try{
    if(!obj?.playerId || !obj?.allyCode) return
    await saveGuildId(obj)
    await playerIdCache.set(obj.allyCode?.toString(), obj.playerId)
    await playerCache.set(obj.playerId, obj)
  }catch(e){
    log.error(e)
  }
}
export default async function(playerId){
  try{
    if(!playerId) return

    let player = await swgohClient('player', { playerId })
    if(!player?.rosterUnit) return

    let profile = calcRosterStats(player.rosterUnit)
    if(!profile?.summary) return

    let stats = { zetaCount: profile.summary.zeta, sixModCount: profile.summary.mod.r6, omiCount: profile.summary.omi, roster: profile.roster, summary: profile.summary }
    stats.omiCount.gac = profile.summary.omi.ga
    stats.omiCount.conquest = profile.summary.omi.cq
    player = { ...player,...stats }
    formatPlayer(player)
    if(!player.gp) return

    await savePlayer(player)
    return player
  }catch(e){
    log.error(e)
  }
}
