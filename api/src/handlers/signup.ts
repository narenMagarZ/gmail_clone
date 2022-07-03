import {NextFunction, Request,Response} from 'express'
import { redis } from '../cacheserver'
import {Users} from '../db/schema/userschema'
import { helpers } from '../helpers'
async function Signup(req:Request,res:Response,next:NextFunction){
    try {
        let {userName,phoneNum,gmailId,password,confirmPassword} = req.body
        if(userName && phoneNum && gmailId && password && confirmPassword){
            userName = userName.trim()
            phoneNum = phoneNum.trim()
            gmailId = gmailId.trim()
            password = password.trim()
            confirmPassword = confirmPassword.trim()
            // check if that gmailid is already exist
            const isUserAlreadyExist = await redis.hget('Users',gmailId)
            if(isUserAlreadyExist) return next(new Error('user already exist'))
            else {
                if(password === confirmPassword){
                    // validate the password , email ,name ,gmail
                    console.log(helpers.IsGmailIdValid(gmailId))
                    console.log(helpers.IsPasswordValid(password))
                    console.log(helpers.IsPhoneNumberValid(phoneNum))
                    console.log(helpers.IsUserNameValid(userName))
                    if(helpers.IsGmailIdValid(gmailId) && helpers.IsPasswordValid(password) && helpers.IsPhoneNumberValid(phoneNum) && helpers.IsUserNameValid(userName)){
                        const securePassword = helpers.GenerateSecurePassword(password)
                        const userInfoObj = {
                            'username' : userName,
                            'phonenum' : phoneNum,
                            'gmail' : gmailId,
                            'password' : securePassword
                        }
                        // write user to the database using message broker - in this case we are going to user rabbitmq
                        const test = await Users.insertMany([userInfoObj])
                        console.log(test)
                        res.json({
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