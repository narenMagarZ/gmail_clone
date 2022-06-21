import express, { Application } from 'express'
import cors from 'cors'
import router from './routes'
function CreateServer():Application{
    const app = express()
    const port = process.env.PORT
    app.use(express.json())
    app.use(express.urlencoded({extended:false})) // it is used to parses the url encoded , having extend as true use the qs library to parse and having false use querystring library
    const whiteList = ['http://localhost:3000','https://localhost:3000']
    app.use(cors((req,callback)=>{
        let corsOption
        if(whiteList.indexOf(req.header('Origin')||'') !== -1){
           corsOption = {
            'origin' : true,
            'credentials':true
           } 
        } else {
            corsOption = {
                'origin' : false
            }
        }
        callback(null,corsOption)
    }))
    app.use('/api',router)
    app.listen(port,function(){
        console.log('server is running on port',port)
    })
    return app
}


CreateServer()
