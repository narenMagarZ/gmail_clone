import {Request,Response} from 'express'
import { redis } from '../cacheserver'
import jwt from 'jsonwebtoken'
import {helpers} from '../helpers'
async function Email(req:Request,res:Response){
    try{
        const id = req.query
        if(id){
            const {gid,key} = req.signedCookies
            if(gid && key){
                const gidChecker = new Promise((resolve)=>{
                    jwt.verify(gid, process.env.ACCESS_TOKEN_SECRET || '',(err:any,decodedContent:any)=>{
                        if(err) resolve({'msg':err.message,'isError':true}) 
                        else resolve({'isError':false,'content':decodedContent})
                     })})
                const keyChecker = new Promise((resolve)=>{
                    jwt.verify(gid, process.env.ACCESS_TOKEN_SECRET || '',(err:any,decodedContent:any)=>{
                        if(err) resolve({'msg':err.message,'isError':true}) 
                        else resolve({'isError':false,'content':decodedContent})
                     })})
                const checkerResolved : any = await Promise.all([gidChecker,keyChecker])
                console.log(checkerResolved)
                if(checkerResolved[0].isError || checkerResolved[0].isError){
                    if(checkerResolved[0].content === 'jwt expired' && checkerResolved[1].content === 'jwt expired'){
                        // regenerate the accesstoken and keytoken

                        // await redis.hget('RefreshTokens',)
                        const accessTokenInfo = {

                        }
                        // helpers.GenerateAccessToken(accessTokenInfo)
                        // helpers.GenerateAccessTokenKey()
                        res.json({
                            'msg':'okay'
                        })
                    } else {
                        // logout the session
                        res.json({
                            'msg':'you are logged out',
                            'status':false
                        })
                    }

                } else if(!checkerResolved[0].isError && !checkerResolved[1].isError) {
                    res.json({
                        'msg':'okay'
                    })
                    
                } else {
                    res.json({
                        'msg':'you are not authenticated user',
                        'status':false
                    }) 
                }
            } else {
                res.json({
                    'msg':'bad request',
                    'status':false
                })
            }
        } else {
            res.json({
                'msg':'bad request',
                'status':false
            })
        }
      
    }
    catch(err){
        console.error(err)
    }
}
export default Email