import {NextFunction, Request,Response} from 'express'
import { helpers } from '../helpers'
import {Users} from '../db/schema/userschema'
import {redis} from '../cacheserver'
async function Login(req:Request,res:Response,next:NextFunction){
    try{
        let {gmailId,password} = req.body
        console.log(req.body,req.headers)
        const platform = req.headers['platform']
        const appId = req.headers['appid']
        const deviceId = req.headers['deviceid']
        if(gmailId && password && platform && appId && deviceId){
            const hashedPassword = helpers.GenerateSecurePassword(password)
            const thatUser = await Users.find({'gmail':gmailId})
            if(thatUser.length > 0){
                console.log(thatUser[0])
                const securedPassword = thatUser[0].password
                if(securedPassword === hashedPassword){
                    const tokenInfo = {
                        'id' : thatUser[0]._id,
                    }
                    const secretKeyInfo = {
                        'platform' : platform,
                        'appId' : appId,
                        'id' : thatUser[0]._id
                    }
                    let thatToken = await redis.hget('RefreshTokens',thatUser[0]._id)
                    console.log(thatToken)
                    let refreshToken
                    if(thatToken) refreshToken = thatToken.trim()
                    else { 
                        refreshToken = helpers.GenerateRefreshToken(tokenInfo)
                        redis.hset('RefreshTokens',thatUser[0]._id,refreshToken)
                    }
                    const accessToken = helpers.GenerateAccessToken(tokenInfo)
                    const accessTokenKey = helpers.GenerateAccessTokenKey(secretKeyInfo)
                    res.cookie('uid',accessToken,helpers.SecureCookieProps)
                    res.cookie('uidkey',accessTokenKey,helpers.SecureCookieProps)
                    res.json({
                        'msg':'you are logged in!',
                        'status':true
                    })
                } else return next(new Error('password does not match'))
            } else return next(new Error('password does not match'))
    
        } else return next(new Error('missing input fields'))
    }
    catch(err){
        if(err instanceof TypeError) return next(new Error(err.message))
        else if(typeof err === 'string') return next(new Error(err))
    }

}
export default Login