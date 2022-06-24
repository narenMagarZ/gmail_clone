import mongoose from "mongoose"
import { mongodbConnector } from "../connector"
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    phone_num:{
        type:String,
        require:true
    },
    gmail:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        require:true
    },
    isActive:{
        type:Boolean,
        require:true
    },
    loggedInDevices:[{
        deviceId:{
            type:String,
            require:true
        },
        loggedInAt:{
            type:Date,
            default:Date.now,
            require:true
        }
    }]
})
export const Users = mongodbConnector.model('Users',userSchema)
