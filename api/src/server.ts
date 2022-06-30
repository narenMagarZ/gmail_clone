import express, { Application, NextFunction , Request, Response } from 'express'
import cors, { CorsOptions } from 'cors'
import cookieParser from 'cookie-parser'
import router from './routes'
import config from '../config'
function CreateServer():Application{
    const app = express()
    app.use(express.urlencoded({extended:false})) // it is used to parses the url encoded , having extend as true use the qs library to parse and having false use querystring library
    app.use(express.json())
    app.use(cookieParser(process.env.COOKIE_SECRET))
    const whiteList = ['http://localhost:3000','https://localhost:3000']
    app.use(cors((req,callback)=>{
        let corsOption : CorsOptions
        if(whiteList.indexOf(req.header('Origin')||'') !== -1){
            corsOption = {
                'origin' : true,
                'credentials':true,
                'methods':['POST','GET','PUT','DELETE'],
            } 
        } else {
            corsOption = {
                'origin' : false
            }
        }
        callback(null,corsOption)
    }))
    app.use('/api',router)
    app.use((err:Error,_req:Request,res:Response,next:NextFunction)=>{
        console.log(err,'this is error')
        res.json({
          'msg':err.message,
          'status':500  
        })
    })
    app.listen(config.port,function(){
        console.log('server is running on port',config.port)
    })

    // process.on('unhandledRejection',(rejection)=>{
    //     console.error(rejection)
    // })
    return app
}

CreateServer()