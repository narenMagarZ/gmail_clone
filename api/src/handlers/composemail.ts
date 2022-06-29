import {NextFunction, Request,Response} from 'express'
import {redis} from '../cacheserver'
import {Users} from '../db/schema/userschema'
import { helpers } from '../helpers'
async function ComposeMail(req:Request,res:Response,next:NextFunction){
    try{
        // console.log(req.body)
        const {mailReceiver,mailTitle,mailSubject,mailBody} = req.body   
        const {uid,uidkey} = req.signedCookies
        const platform = req.headers['platform']
        const appId = req.headers['appid']
        const deviceId = req.headers['deviceid']
        // console.log(appId,platform,deviceId,uid,uidkey)
        if(mailReceiver && mailTitle && mailSubject && mailBody && uid && uidkey && platform && appId && deviceId){
            const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET || ''
            const secretKey = process.env.TOKEN_KEY_SECRET || ''
            const tokenVerification = await Promise.all([helpers.VerifyTheToken(uid,accessTokenSecretKey),helpers.VerifyTheToken(uidkey,secretKey)])
            // console.log(tokenVerification)
            let tokenInfoAfterVerification             
            if(tokenVerification[1][0]){
                tokenInfoAfterVerification = {
                    'isError' : true,
                    'tokenInfo' : null
                }
            } else if(tokenVerification[0][0]){
                if(tokenVerification[0][1] === 'jwt expired' && !tokenVerification[1][0]){
                    tokenInfoAfterVerification = {
                        'isError' : false ,
                        'tokenInfo' : {
                            'accesstoken' : null,
                            'tokenkey' : tokenVerification[1][1]
                        }
                    }
                }
                else {
                    tokenInfoAfterVerification = {
                        'isError' : true,
                        'tokenInfo' : null
                    }
                }

            } else {
                // then token is verified
                tokenInfoAfterVerification = {
                    'isError' : false ,
                    'tokenInfo' : {
                        'accesstoken' : tokenVerification[0][1],
                        'tokenkey' : tokenVerification[1][1]
                    }
                }
            }
            if(tokenInfoAfterVerification.isError){
                return next(new Error('no authenticated user'))
            } else {
                console.log(tokenInfoAfterVerification)
                const {tokenInfo} = tokenInfoAfterVerification
                const idInKey = tokenInfo?.tokenkey.id
                const platformInKey = tokenInfo?.tokenkey.platform
                const appIdInKey = tokenInfo?.tokenkey.appId
                if(tokenInfo?.accesstoken){
                    const {id} = tokenInfo.accesstoken
                    if((id === idInKey) && (platform === platformInKey) && (appId === appIdInKey)){
                       const refreshToken = await redis.hget('RefreshTokens',id)
                       if(refreshToken){
                            const refreshTokenVerificationInfo = await helpers.VerifyTheToken(refreshToken,process.env.REFRESH_TOKEN_SECRET||'')
                            if(refreshTokenVerificationInfo[0]) return next(new Error('refresh token is already expired'))
                                else {
                                const userId =  refreshTokenVerificationInfo[1].id.trim()
                                if(userId === id.trim()){
                                    // check for the existence of the user in the cache server
                                    const checkForExistenceOfUsers : any = await Promise.resolve(redis.pipeline().hget('Users',userId).hget('Users',mailReceiver.trim()).exec())
                                    console.log(checkForExistenceOfUsers,'check for existence of user')
                                    if(checkForExistenceOfUsers[0][1] && checkForExistenceOfUsers[1][1]){
                                        res.json({
                                            'msg':'you can now write mail '
                                        })
                                    } else {
                                        // check for the existence of the user in main database
                                        async function* generator(){
                                            if(!checkForExistenceOfUsers[0][1]) yield helpers.IsUserExistInDB(Users,userId) 
                                            else yield true
                                            if(!checkForExistenceOfUsers[1][1]) yield helpers.IsUserExistInDB(Users,mailReceiver.trim())
                                            else yield true
                                        }
                                            let generatorPointer = 0
                                            let userToStoredInCache = [userId,mailReceiver.trim()]
                                            let areUsersValidOnDatabase = [false,false]
                                            for await(const isUserExist of generator()){
                                                areUsersValidOnDatabase[generatorPointer] = isUserExist
                                                if(isUserExist && !checkForExistenceOfUsers[generatorPointer][1]) {
                                                    redis.hset('Users',userToStoredInCache[generatorPointer],1)
                                                }
                                                generatorPointer ++
                                            }
                                            userToStoredInCache = []
                                            // write the email to the database
                                            if(areUsersValidOnDatabase[0] && areUsersValidOnDatabase[1]){
                                                return res.json({
                                                    'msg':"generators is executed"
                                                })
                                            } else return next(new Error('no users are found'))
                                    }   
                                } else return next(new Error('no authenticated user'))
                                }
                       } else return next(new Error('your session is already expired'))
                    } else return next(new Error('no authenticated user'))
                } else {
                    // generate the new accesstoken
                    const refreshToken = await redis.hget('RefreshTokens',idInKey) || ''
                    const refreshTokenVerificationInfo = await helpers.VerifyTheToken(refreshToken,process.env.REFRESH_TOKEN_SECRET||'')
                    if(refreshTokenVerificationInfo[0]) return next(new Error('refresh token is already expired'))
                    else {
                        const userId = refreshTokenVerificationInfo[1].id.trim()
                        if((userId === idInKey) && (platformInKey === platform) && (appIdInKey === appId)){
                            const newAccessToken = helpers.GenerateAccessToken({'id':userId})
                            // res.cookie('uid',newAccessToken,{signed:true,httpOnly:true,sameSite:'strict',secure:true})
                            // check the user existence in cache and main db
                           const isUserExistInCache = await helpers.IsUserExistInCache(redis,mailReceiver.trim())
                           console.log(isUserExistInCache,'this is what u got')
                           if(isUserExistInCache){
                            res.json({
                                'msg':'now you can write the mail'
                            })
                           } else {
                            // check in main db for user
                            const isUserExistInDB = await helpers.IsUserExistInDB(Users,mailReceiver.trim())
                            console.log(isUserExistInDB,'checking the user inside the db')
                            if(isUserExistInDB){
                                // then write to the db
                                res.json({
                                    'msg':'you can write the mail'
                                })
                            } else return next(new Error("receiver is not found in db"))
                           }
                        } else return next(new Error('no authenticated user'))
                    }

                }
            }


        } else return next(new Error('missing info fields'))
    }catch(err:any){
        return next(new Error(err.message))
    }

}
export default ComposeMail