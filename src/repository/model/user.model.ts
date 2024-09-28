import mongoose, { Schema } from "mongoose";
import { UserSchema } from "../../interface/enitities";

const userSchema : Schema = new Schema<UserSchema>({
    name:{
        type:String,
        reuqired:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:Number
    }
})

export const UserModel = mongoose.model<UserSchema>('users',userSchema)