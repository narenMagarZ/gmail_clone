import mongoose from "mongoose"

function CreateConnctionToMongo(host?:string,port?:string){
        const MONGOURI = `mongodb://${host}:${port}/test`
        const connection = mongoose.createConnection(MONGOURI)
        return connection
}

export const mongodbConnector = CreateConnctionToMongo(process.env.MONGOHOST,process.env.MONGOPORT)