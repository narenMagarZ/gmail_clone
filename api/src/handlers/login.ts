import {Request,Response} from 'express'
import { helpers } from '../helpers/helpers'

function Login(req:Request,res:Response){
    console.log(req.body)
    let {gmailId,password,userId} = req.body
    if(gmailId && password && userId){
        const hashedPassword = helpers.GenerateSecurePassword(password)
    } else {
        res.json({
            'status':403,
            'msg':'fail'
        })
    }
}
export default Login