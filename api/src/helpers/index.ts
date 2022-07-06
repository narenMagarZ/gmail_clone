import {createHmac} from 'node:crypto'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Redis from 'ioredis'
interface helpers {
    GenerateSecurePassword:(plainPassword:string)=>string,
    GenerateAccessToken:(tokenInfo:{})=>string
    GenerateRefreshToken:(tokenInfo:{})=>string
    GenerateAccessTokenKey:(secretKeyInfo:{})=>string,
    IsUserExistInDB:(Users:mongoose.Model<any>,gmail:string)=>Promise<any>
    VerifyTheToken:(token:string,secretKey:string)=>Promise<[boolean,any]>
    IsUserExistInCache:(cache:Redis,user:string)=>Promise<any>
    IsPhoneNumberValid:(phoneNum:string)=>boolean
    IsUserNameValid:(name:string)=>boolean
    IsPasswordValid:(password:string)=>boolean
    IsGmailIdValid:(gmailId:string)=>boolean
    SecureCookieProps:{}

}
export const helpers : helpers = {
    'GenerateSecurePassword' : ()=>'',
    'GenerateAccessToken' : ()=>'',
    'GenerateRefreshToken' : ()=>'',
    'GenerateAccessTokenKey' : ()=>'',
    'IsUserExistInDB':async()=>false,
    'VerifyTheToken':async()=>[false,null],
    'IsUserExistInCache':async()=>null,
    'IsPhoneNumberValid':()=>false,
    'IsUserNameValid':()=>false,
    'IsPasswordValid':()=>false,
    'IsGmailIdValid':()=>false,
    'SecureCookieProps':{signed:true,httpOnly:true,sameSite:'strict',secure:true},
}

helpers.GenerateSecurePassword = function(plainPassword){
    const SALT = "somerandomsecurepasswordhaha123"
    const hMacObj = createHmac('sha256',SALT)
    return hMacObj.update(plainPassword).digest('hex')
}


helpers.GenerateAccessToken = function(userInfo){
    const accessToken = jwt.sign(userInfo,process.env.ACCESS_TOKEN_SECRET || '',{expiresIn:"2000s"})
    return accessToken
}
helpers.GenerateRefreshToken = function(userInfo){
    const refreshToken = jwt.sign(userInfo,process.env.REFRESH_TOKEN_SECRET || '',{expiresIn:"30 days"})
    return refreshToken
}


helpers.GenerateAccessTokenKey = function(secretKeyInfo){
    const accessTokenKey = jwt.sign(secretKeyInfo,process.env.TOKEN_KEY_SECRET || '',{expiresIn:'30 days'})
    return accessTokenKey
}

helpers.IsUserExistInDB = async function(Users,gmail){
    return Promise.resolve(Users.findOne({'gmail':gmail}))

}

helpers.VerifyTheToken = function(token,secretKey){
    return new Promise((resolve)=>{
        jwt.verify(token,secretKey,(err:any,decodeContent:any)=>{
            if(err) resolve([false,err.message])
            else resolve([true,decodeContent])
        })
    })
}


helpers.IsUserExistInCache = function(cache,user){
    return Promise.resolve(cache.hget('Users',user))
}


helpers.IsPhoneNumberValid = function(phoneNum){
    const validPhoneNum = /^[0-9]{10}$/
    if(validPhoneNum.test(phoneNum)) return true
    else return false
}

helpers.IsUserNameValid = function(userName){
    const validName = /^[A-z\s]{3,20}$/
    if(validName.test(userName)) return true
    return false
}


helpers.IsPasswordValid = function(password){
    const validPassword = /^[\S]{8,}$/
    if(validPassword.test(password)) return true
    else return false
}

helpers.IsGmailIdValid = function(gmailId){
    const validGmailId = /^[a-z]{1,}[0-9]*@gmail.com$/
    if(validGmailId.test(gmailId)) return true
    else return false
}

