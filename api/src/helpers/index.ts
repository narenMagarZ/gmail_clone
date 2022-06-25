import {createHmac} from 'node:crypto'
import jwt from 'jsonwebtoken'
interface helpers {
    GenerateSecurePassword:(plainPassword:string)=>void
    GenerateAccessToken:()=>void
}
export const helpers : helpers = {
    'GenerateSecurePassword' : ()=>{},
    'GenerateAccessToken' : ()=>{}
}

helpers.GenerateSecurePassword = function(plainPassword:string){
    const SALT = "somerandomsecurepasswordhaha123"
    const hMacObj = createHmac('sha256',SALT)
    return hMacObj.update(plainPassword).digest('hex')
}


helpers.GenerateAccessToken = function(){

}

