import mongoose from 'mongoose'
import { mongodbConnector } from '..'

const emailSchema = new mongoose.Schema({
    mailComposer :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    from :{
        type:String,
        require:true
    },
    to:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        require:true,
        default:Date.now
    },
    title:{
        type:String,
        require:true
    },
    body:{
        subject:{
            type:String,
            require:true
        },
        content:{
            text:{
                type:String,
                require:true        
            },
            files:[{
                fileName:{
                    type:String,
                    require:false
                },
                filePath:{
                    type:String,
                    require:false
                },
                fileSize:{
                    type:String,
                    require:false
                },
                fileType:{
                    type:String,
                    require:false
                }
            }]
        }
    }
})


export const Emails = mongodbConnector.model('Emails',emailSchema)