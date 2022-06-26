import mongoose from 'mongoose'
import { mongodbConnector } from '..'

const emailSchema = new mongoose.Schema({
    mailComposer :{
        types : mongoose.Schema.Types.ObjectId,
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
    body:{
        subject:{
            type:String,
            default:""
        },
        content:{
            text:{
                type:String,
                default:"",
            },
            files:[{
                fileId:{
                    type:String
                },
                filePath:{
                    type:String
                },
                fileSize:{
                    type:String
                },
                fileType:{
                    type:String
                }
            }]
        }
    }
})


export const Emails = mongodbConnector.model('Emails',emailSchema)