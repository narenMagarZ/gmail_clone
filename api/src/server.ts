import express, { Application } from 'express'
import cors, { CorsOptions } from 'cors'
import router from './routes'
import config from '../config'

function CreateServer():Application{
    const app = express()
    app.use(express.urlencoded({extended:false})) // it is used to parses the url encoded , having extend as true use the qs library to parse and having false use querystring library
    app.use(express.json())
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
    app.listen(config.port,function(){
        console.log('server is running on port',config.port)
    })
    return app
}

CreateServer()