import express, { Application } from 'express'

function CreateServer():Application{
    const app = express()
    const port = process.env.PORT
    app.listen(port,function(){
        console.log('server is running on port',port)
    })
    return app
}


CreateServer()
