import {Request,Response} from 'express'
import { helpers } from '../helpers/helpers'
import {Users} from '../db/schema/userschema'
async function Login(req:Request,res:Response){
    let {gmailId,password,userId} = req.body
    gmailId = gmailId.trim()
    password = password.trim()
    userId = userId.trim()
    if(gmailId && password && userId){
        const hashedPassword = helpers.GenerateSecurePassword(password)
        const thatUser = await Users.find({'gmail':gmailId})
        if(thatUser.length > 0){
            console.log(thatUser[0])
            const securedPassword = thatUser[0].password
            if(securedPassword === hashedPassword){
                res.json({
                    'msg':'you are logged in!',
                    'status':'true'
                })
            } else {
                res.json({
                    'msg':"password does not match!",
                    'status':'false'
                })
            }
        } else {
            res.json({
                'msg':"no such user is found!",
                'status':'false'
            })
        }

    } else {
        res.json({
            'msg':'missing info fields',
            'status':'false'
        })
    }
}
export default Login