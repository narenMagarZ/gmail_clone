import {Request,Response} from 'express'
import { helpers } from '../helpers'
import {Users} from '../db/schema/userschema'
import jwt from 'jsonwebtoken'
import {redis} from '../cacheserver'
async function Login(req:Request,res:Response){
    try{
        let {gmailId,password,platformId,appId} = req.body
        if(gmailId && password && platformId && appId){
            gmailId = gmailId.trim()
            password = password.trim()
            platformId = platformId.trim()
            appId = appId.trim()
            const hashedPassword = helpers.GenerateSecurePassword(password)
            const thatUser = await Users.find({'gmail':gmailId})
            if(thatUser.length > 0){
                console.log(thatUser[0])
                const securedPassword = thatUser[0].password
                if(securedPassword === hashedPassword){
                    const tokenInfo = {
                        'id' : thatUser[0].gmail,
                    }
                    let thatToken = await redis.hget('RefreshTokens',thatUser[0].gmail)
                    console.log(thatToken)
                    let refreshToken
                    if(thatToken){
                        refreshToken = thatToken.trim()
                    } else {
                        refreshToken = jwt.sign(tokenInfo,process.env.REFRESH_TOKEN_SECRET || '',{expiresIn:"30 days"})
                        redis.hset('RefreshTokens',thatUser[0].gmail,refreshToken)
                    }
                    const accessToken = jwt.sign(tokenInfo,process.env.ACCESS_TOKEN_SECRET || '',{expiresIn:"40000"})
                    const accessTokenKey = jwt.sign({'platform':platformId,'appId':appId,'uid':thatUser[0].gmail},process.env.TOKEN_KEY_SECRET || '',{expiresIn:'30 days'})
                    res.cookie('gid',accessToken,{signed:true,httpOnly:true,sameSite:'strict',secure:true})
                    res.cookie('key',accessTokenKey,{signed:true,httpOnly:true,sameSite:'strict',secure:true})
                    res.json({
                        'msg':'you are logged in!',
                        'status':true
                    })
                } else {
                    res.json({
                        'msg':"password does not match!",
                        'status':false
                    })
                }
            } else {
                res.json({
                    'msg':"no such user is found!",
                    'status':false
                })
            }
    
        } else {
            res.json({
                'msg':'missing info fields',
                'status':false
            })
        }
    }
    catch(err){
        console.error(err)
        res.json({
            'msg':'something wrong happened',
            'status':false
        })
    }

}
export default Login