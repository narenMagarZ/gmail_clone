import Redis from 'ioredis'
function CacheServer(){
    const redis = new Redis({
        host:'127.0.0.1',
        port:6379
    })
    return redis
}
export const redis = CacheServer()