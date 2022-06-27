import {createHmac} from 'node:crypto'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
interface helpers {
    GenerateSecurePassword:(plainPassword:string)=>void
    GenerateAccessToken:(userInfo:{})=>void
    GenerateAccessTokenKey:(platformId:string,appId:string)=>void,
    GenerateUniqueId:()=>void
    IsUserValid:(Users:mongoose.Model<any>,gmail:string)=>Promise<boolean>
}
export const helpers : helpers = {
    'GenerateSecurePassword' : ()=>{},
    'GenerateAccessToken' : ()=>{},
    'GenerateAccessTokenKey' : ()=>{},
    'GenerateUniqueId' : ()=>{},
    'IsUserValid':async()=>false
}

helpers.GenerateSecurePassword = function(plainPassword:string){
    const SALT = "somerandomsecurepasswordhaha123"
    const hMacObj = createHmac('sha256',SALT)
    return hMacObj.update(plainPassword).digest('hex')
}


helpers.GenerateAccessToken = function(userInfo){
    const accessToken = jwt.sign(userInfo,process.env.ACCESS_TOKEN_SECRET || '',{expiresIn:"40000"})
    return accessToken
}


helpers.GenerateAccessTokenKey = function(platformId:string,appId:string){
    const accessTokenKey = jwt.sign({'platform':platformId,'appId':appId},process.env.TOKEN_KEY_SECRET || '',{expiresIn:'40000'})
    return accessTokenKey
}

helpers.GenerateUniqueId = function(){

}


helpers.IsUserValid = async function(Users:mongoose.Model<any>,gmail:string){
    const userInfo = await Users.findOne({'gmail':gmail})
    console.log(userInfo)
    if(userInfo) return true
    else return false
}