import {createHmac} from 'node:crypto'
import jwt from 'jsonwebtoken'
interface helpers {
    GenerateSecurePassword:(plainPassword:string)=>void
    GenerateAccessToken:(userInfo:{})=>void
    GenerateAccessTokenKey:(platformId:string,appId:string)=>void
}
export const helpers : helpers = {
    'GenerateSecurePassword' : ()=>{},
    'GenerateAccessToken' : ()=>{},
    'GenerateAccessTokenKey' : ()=>{}
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