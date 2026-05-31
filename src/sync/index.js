import log from '../logger.js'
import { swgohCache } from '../cache.js'
import getGuild from './get_guild.js'

async function syncGuilds(){
  try{
    let guilds = await swgohCache.all('guilds', { sync: 1 }, { _id: 1, sync: 1})
    if(!guilds || guilds?.length == 0) return
    for(let g of guilds) await getGuild(g._id)
  }catch(e){
    log.error(e)
  }
}

async function sync(){
  try{
    await syncGuilds()
    setTimeout(sync, 5000)
  }catch(e){
    log.error(e)
    setTimeout(sync, 5000)
  }
}
export default { start: sync }
