import log from '../logger.js'
import getPlayer from './get_player.js'
import { eachLimit } from 'async'
const maxRetry = 6

function filterMembers(all = [], found = []){
  if(found?.length === 0) return all
  let foundIds = found?.map(x=>x.playerId);
  return all.filter(x=>!foundIds.includes(x.playerId));
}

async function getMembers(members = []){
  let res = []
  await eachLimit(members, 25, async(member)=>{
    let player = await getPlayer(member.playerId)
    if(player?.allyCode) res.push(player)
  })
  return res
}
export default async function(members = []){
  if(members.length == 0) return
  let count = 0, res = [], timeStart = Date.now()
  while(count < maxRetry){
    let tempMembers = filterMembers(members, res)
    let tempRes = await getMembers(tempMembers)
    if(tempRes?.length === members?.length) return tempRes
    if(tempRes?.length > 0) res = res.concat(tempRes)
    if(res?.length === members?.length) break;
    count++
  }
  return res
}
