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
                if(tokenInfo?.accesstoken){
                    const {id} = tokenInfo.accesstoken
                    const idInKey = tokenInfo.tokenkey.id
                    const platformInKey = tokenInfo.tokenkey.platform
                    const appIdInKey = tokenInfo.tokenkey.appId
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
                                            if(!checkForExistenceOfUsers[0][1]) yield helpers.IsUserValid(Users,userId) 
                                            else yield true
                                            if(!checkForExistenceOfUsers[1][1]) yield helpers.IsUserValid(Users,mailReceiver.trim())
                                            else yield true
                                        }
                                            for await(const isUserExist of generator()){
                                                console.log(isUserExist)
                                                
                                            }
                                            return res.json({
                                                'msg':"generators is executed"
                                            })
                                    }   
                                } else return next(new Error('no authenticated user'))
                                }
                       } else return next(new Error('your session is already expired'))
                    } else return next(new Error('no authenticated user'))
                } else {
                }
                res.json({
                    'msg':true
                })
            }


        } else return next(new Error('missing info fields'))
    //     if(mailComposer && mailReceiver && mailTitle && mailSubject && mailBody  && platform && appId && deviceId) {
    //         const {textContent,files} = mailBody
    //         console.log(textContent,files)
    //         // check for the existence of the composer and receiver
    //         let areUsersValid = false
    //         const isUsersValid = await new Promise((resolve)=>{
    //             redis.pipeline().hget('Users',mailComposer).hget('Users',mailReceiver).exec((err,result:any)=>{
    //                 if(err) return next(err)
    //                 else {
    //                     if(result[0][1] && result[1][1]) resolve(true) 
    //                     else resolve(false)
    //                 }
    //             })
    //         }) 
    //         if(isUsersValid){
    //             areUsersValid = true
    //         } else {

    //         if(isMailComposerValid && isMailReceiverValid){
    //             areUsersValid = true
    //         } else areUsersValid = false
    //         }
    //         if(areUsersValid) {                 
    //             res.json({
    //                 msg:'okay'
    //             })
    //         } else return next(new Error('user is not found !'))
            
    //     } else {
    //        return next(new Error('missing info fields'))
    //     }
    }catch(err:any){
        if(err)
        return next(new Error(err.message))
    }

}
export default ComposeMail