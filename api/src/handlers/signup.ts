import {Request,Response} from 'express'
import {Users} from '../db/schema/userschema'
import { helpers } from '../helpers/helpers'
async function Signup(req:Request,res:Response){
    try {
        let {userName,phoneNum,gmailId,password,confirmPassword,userId} = req.body
        userName = userName.trim()
        phoneNum = phoneNum.trim()
        gmailId = gmailId.trim()
        password = password.trim()
        confirmPassword = confirmPassword.trim()
        userId = userId.trim()
        if(userName && phoneNum && gmailId && password && confirmPassword && userId){
            if(password === confirmPassword){
                const securePassword = helpers.GenerateSecurePassword(password)
                const userInfoObj = {
                    'username' : userName,
                    'phonenum' : phoneNum,
                    'gmail' : gmailId,
                    'password' : securePassword,
                    'isActive' : true,
                    'loggedInDevices' : [{
                        'deviceId' : userId
                    }]
            
                }
                const test = await Users.insertMany([userInfoObj])
                console.log(test)
                res.json({
                    'msg':'okay',
                    'status':'true'
                })
            } else {
                res.json({
                    'msg':"password and confirm password do not match!",
                    'status':'false'
                })
            }
        } else {
            res.json({
                'msg':'missing info fields!',
                'status':'false'
            })
        }

    } catch (err) {
        console.error(err)
        res.json({
            'msg':"something wrong happened!",
            'status':'false'
        })


    }

    
}
export default Signup