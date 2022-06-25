import {Request,Response} from 'express'
import { redis } from '../cacheserver'
import jwt from 'jsonwebtoken'
async function Email(req:Request,res:Response){
    try{
        const id = req.query
        if(id){
            const {gid,key} = req.signedCookies
            if(gid && key){
                const ans = await new Promise((resolve)=>{
                    jwt.verify(gid, process.env.ACCESS_TOKEN_SECRET || '',(err:any,decodedContent:any)=>{
                        if(err) resolve(true) 
                        else resolve(decodedContent)
                     })})
                    console.log(ans)

                
                    res.json({
                        'msg':'okay'
                    })
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