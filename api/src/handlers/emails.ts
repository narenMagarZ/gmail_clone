import {Request,Response} from 'express'

function Email(req:Request,res:Response){
    if(req.signedCookies['name'])
    return res.json({
        'msg':'okay'
    })
    else res.json({
        'msg':'you are not authenticated'
    })
}
export default Email