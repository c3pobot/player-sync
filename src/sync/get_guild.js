import log from '../logger.js'
import swgohClient from '../swgoh_client.js'
import formatGuild from './format_guild.js'
import getPlayers from './get_players.js'
import { guildCache } from '../cache.js'

export default async function(guildId){
  try{
    if(!guildId) return

    let timeStart = Date.now()
    let guild = await swgohClient('guild', { guildId, includeRecentGuildActivityInfo: true })
    guild = guild?.guild
    if(!guild?.member) return

    guild.member = guild.member.filter(x=>x.memberLevel > 1)
    let members = await getPlayers(guild.member)
    let timeEnd = Date.now()

    if(guild?.member?.length !== members?.length) return
    formatGuild(guild, members)
    if(!guild.gp) return

    await guildCache.set(guildId, guild)
    log.debug(`guild pull took ${(timeEnd - timeStart) / 1000} seconds`)
  }catch(e){
    log.error(e)
  }
}
