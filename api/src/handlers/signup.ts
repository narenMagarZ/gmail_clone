import {NextFunction, Request,Response} from 'express'
import { redis } from '../cacheserver'
import {Users} from '../db/schema/userschema'
import { helpers } from '../helpers'
import joi from 'joi'
async function Signup(req:Request,res:Response,next:NextFunction){
    try {
        let {userName,phoneNum,gmailId,password,confirmPassword} = req.body
        const schema = joi.object({
            userName:joi.string().min(3).max(20).required(),
            phoneNum:joi.string().equal(10).required(),
            gmailId:joi.string()
        })
        if(userName && phoneNum && gmailId && password && confirmPassword){
            // check if that gmailid is already exist
            const isUserAlreadyExist = await redis.hget('users',gmailId)
            if(isUserAlreadyExist) return next(new Error('user already exist'))
            else {
                if(password === confirmPassword){
                    // validate the password , email ,name ,gmail
                    if(helpers.IsGmailIdValid(gmailId) && helpers.IsPasswordValid(password) && helpers.IsPhoneNumberValid(phoneNum) && helpers.IsUserNameValid(userName)){
                        const securePassword = helpers.GenerateSecurePassword(password)
                        const userInfoObj = {
                            'username' : userName,
                            'phonenum' : phoneNum,
                            'gmail' : gmailId,
                            'password' : securePassword
                        }
                        // write user to the database using message broker - in this case we are going to user rabbitmq
                        const user = new Users(userInfoObj)
                        await user.save()
                        const  uId = user._id.valueOf()
                        await redis.hset('users',uId,gmailId)
                        await redis.hset('users',gmailId,uId)
                        return res.json({
                            'msg':'successfully created account',
                            'status':true
                        })
                    } else return next(new Error('invalid input field'))
                
                } else return next(new Error('password and confirma password does not match'))
            }
        } else return next(new Error('missing info fields'))

    } catch (err) {
        if(err instanceof TypeError) return next(new Error(err.message))
        if(typeof err === 'string' ) return next(new Error(err))
    }

    
}
export default Signup