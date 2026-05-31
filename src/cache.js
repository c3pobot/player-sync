import { ValkeyCache } from 'valkey-cache'
import { MongoCache, MongoCacheShared } from 'mongo-cache'

const guildCache = new ValkeyCache({ keyPrefix: `GUILD`, jsonOnly: true, defaultTTL: 300 })
const guildIdCache = new ValkeyCache({ keyPrefix: `GUILDID`, jsonOnly: true, defaultTTL: 604800 })
const playerIdCache = new ValkeyCache({ keyPrefix: `PLAYERID`, defaultTTL: 604800 })
const playerCache = new ValkeyCache({ keyPrefix: `PLAYER`, jsonOnly: true, defaultTTL: 300 })

let connectionString = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST+'/?compressors=zlib&retryReads=true&retryWrites=true&maxPoolSize=200'
if(process.env.MONGO_AUTH_DB) connectionString += '&authSource='+process.env.MONGO_AUTH_DB
if(process.env.MONGO_REPSET) connectionString += '&replicaSet='+process.env.MONGO_REPSET

const swgohCache = new MongoCache({
  connection_string: connectionString,
  db_name: `swgoh`
})

function status(){
  let status = playerCache.status()
  if(!status) return
  return swgohCache.status()
}
export default { status }
export { guildCache, guildIdCache, playerIdCache, playerCache, swgohCache }
