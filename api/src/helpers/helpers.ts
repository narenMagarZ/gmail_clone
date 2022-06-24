import {createHmac} from 'node:crypto'
interface helpers {
    GenerateSecurePassword:(plainPassword:string)=>void
}
export const helpers : helpers = {
    'GenerateSecurePassword' : ()=>{}
}

helpers.GenerateSecurePassword = function(plainPassword:string){
    const SALT = "somerandomsecurepasswordhaha123"
    const hMacObj = createHmac('sha256',SALT)
    return hMacObj.update(plainPassword).digest('hex')
}