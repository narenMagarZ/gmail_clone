import {Request,Response,NextFunction} from 'express'
import url from 'node:url'
import { redis } from '../cacheserver'
import { helpers } from '../helpers'



interface middlewares {
    'IsUserAuthenticated' : (req:Request,res:Response,next:NextFunction)=>void
}
export const middlewares : middlewares = {
    'IsUserAuthenticated' : ()=>{}
}

interface requser {
    'user':string | null
}
export let reqUserInfo : requser = {
    'user' : null
}
middlewares.IsUserAuthenticated = async function(req:Request,_res:Response,next:NextFunction){
    reqUserInfo = {
        'user':null
    }
    const secureApiEndPoints = ['/emails','/composemail']
    const parsedURL = url.parse(req.url,true)
    const extractApiEndPoint = parsedURL.pathname?.substring(4) || ''
    if(secureApiEndPoints.indexOf(extractApiEndPoint) > -1){
        // check for user authentication
        const platform = req.headers['platform']
        const appId = req.headers['appid']
        const deviceId = req.headers['deviceid']
        const {uid,uidkey} = req.signedCookies
        console.log(platform,appId,deviceId,uid,uidkey)
        if(uid && uidkey && platform && appId && deviceId){
            // verify uid and uidkey
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || ''
            const tokenSecretKey = process.env.TOKEN_KEY_SECRET || ''
           const tokenVerification = await Promise.all([helpers.VerifyTheToken(uid,accessTokenSecret),helpers.VerifyTheToken(uidkey,tokenSecretKey)])
           let tokenInfoAfterVerification             
           console.log(tokenVerification)
           if(!tokenVerification[0][0]){
                if(tokenVerification[0][1] === 'jwt expired' && tokenVerification[1][0]){
                    tokenInfoAfterVerification = {
                        'isError' : false,
                        'tokenInfo' : {
                            'accessTokenInfo' : null,
                            'secretKeyInfo' : tokenVerification[1][1]
                        }
                    }
                } else {
                    tokenInfoAfterVerification = {
                        'isError' : true , 
                        'tokenInfo' : null
                    }
                }
           } else if(tokenVerification[0][0] && tokenVerification[1][0]){
            tokenInfoAfterVerification = {
                'isError' : false , 
                'tokenInfo' : {
                    'accessTokenInfo' : tokenVerification[0][1],
                    'secretKeyInfo' : tokenVerification[1][1]
                }
            }
           } else {
            tokenInfoAfterVerification = {
                'isError' : true,
                'tokenInfo' : null
            }
           }
           if(!tokenInfoAfterVerification.isError){
                if(tokenInfoAfterVerification.tokenInfo){
                    const {accessTokenInfo,secretKeyInfo} = tokenInfoAfterVerification.tokenInfo
                    if(accessTokenInfo && secretKeyInfo){
                        const refUid = accessTokenInfo.id
                        const refUidFromKey = secretKeyInfo.id
                        const refPlatform = secretKeyInfo.platform
                        const refAppId = secretKeyInfo.appId
                        const userGmailToken = await redis.hget('RefreshTokens',refUid)
                        if(userGmailToken){
                           const gmailIdInfo =  await helpers.VerifyTheToken(userGmailToken,process.env.REFRESH_TOKEN_SECRET||'')
                           if(gmailIdInfo[0]){
                                if(refUid === refUidFromKey && refUid === gmailIdInfo[1].id && refPlatform === platform && refAppId === appId) {
                                    reqUserInfo.user = gmailIdInfo[1].id
                                    return next()
                                } else return next(new Error('invalid user'))
                           } else return next(new Error('invalid user'))
                        } else return next(new Error('invalid user'))
                    } else{

                    }
                } else return next(new Error('invalid user'))
           } else return next(new Error('invalid user'))
        } else return next(new Error('invalid user'))
    } else return next()
}

