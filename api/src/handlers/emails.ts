import {Request,Response} from 'express'
import { redis } from '../cacheserver'
import jwt from 'jsonwebtoken'
import {helpers} from '../helpers'
async function Email(req:Request,res:Response){
    try{
        const id = req.query
        const _platform  = req.headers['platform']
        const _appId = req.headers['appid']
        let resObj : {
            'status': boolean
            'msg': string 
        }
        const {gid,key} = req.signedCookies
        if(id && typeof _platform === 'string' &&  typeof _appId === 'string'
        && _platform.length > 1 && _appId.length > 1 && gid && key){
                const gidChecker = new Promise((resolve)=>{
                    jwt.verify(gid, process.env.ACCESS_TOKEN_SECRET || '',(err:any,decodedContent:any)=>{
                        if(err) resolve({'msg':err.message,'isError':true}) 
                        else resolve({'isError':false,'content':decodedContent})
                     })})
                const keyChecker = new Promise((resolve)=>{
                    jwt.verify(key, process.env.TOKEN_KEY_SECRET || '',(err:any,decodedContent:any)=>{
                        if(err) resolve({'msg':err.message,'isError':true}) 
                        else resolve({'isError':false,'content':decodedContent})
                     })})
                const checkerResolved : any = await Promise.all([gidChecker,keyChecker])
                console.log(checkerResolved)
                if(checkerResolved[0].isError && !checkerResolved[1].isError){
                    if(checkerResolved[0].msg === 'jwt expired'){
                        const {id,platform,appId} = checkerResolved[1].content
                            if(platform === _platform.trim() && appId === _appId.trim()){
                                 // if platform and appid is matched
                                const refreshToken = await redis.hget("RefreshTokens",id)
                                if(refreshToken){
                                   const refreshTokenValidity = await new Promise(resolve=>{
                                    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET || '',(err,content)=>{
                                        if(err) resolve({isError:true})
                                        else resolve({isError:false})
                                    })
                                   })
                                   if(refreshTokenValidity){
                                    resObj = {
                                        'msg' : 'your session is expired',
                                        'status' : false
                                    }
                                    res.json(resObj)
                                   }
                                   else {
                                       const accessToken = helpers.GenerateAccessToken({'id':id})
                                       res.cookie('gid',accessToken,{signed:true,httpOnly:true,sameSite:'strict',secure:true})
                                       resObj = {
                                           'status' : true,
                                           'msg' : 'your emails are listed below'
                                       }
                                   }
                                } else {
                                    resObj = {
                                        'msg' : 'your session is expired',
                                        'status' : false
                                    }
                                    res.json(resObj)
                                }
                            } else {
                                // if platform and appid is not matched 
                                resObj = {
                                    'status' : false,
                                    'msg' : 'not authenticated user'
                                }
                            }
                    } else {
                        resObj = {
                            'msg' : 'your session is expired',
                            'status' : false
                        }
                        res.json(resObj)
                    }
                } else if(checkerResolved[1].isError){
                    resObj = {
                        'status' : false,
                        'msg' : 'not authenticated user'
                    }
                    res.json(resObj)
                } 
                else if(checkerResolved[0].isError && checkerResolved[1].isError){
                    resObj = {
                        'status' : false,
                        'msg' : 'not authenticated user'
                    }
                    res.json(resObj)
                }
                else if(!checkerResolved[0].isError && !checkerResolved[1].isError) {
                    resObj = {
                        'status' : true,
                        'msg' : 'okay'
                    }
                    res.json(resObj)
                    
                } else {
                    resObj = {
                        'status' : false,
                        'msg' : 'not authenticated user'
                    }
                    res.json(resObj)
                }
        } else {
                resObj = {
                    'status' : false,
                    'msg' : 'not authenticated user'
                }
                res.json(resObj)
        }
    }
    catch(err){
        console.error(err)
    }
}
export default Email