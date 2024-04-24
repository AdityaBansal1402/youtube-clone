const mongoose = require ('mongoose');

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
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
    date:{
        type:Date,
        default: Date.now
    },
    pic:{
        type: String,
        default:""
    },
    subscribers:{
        type:Number,
        default:0
    },
    subcribedUsers:{
        type:[String]
    },
    likedvids:{
        type:[String]
    }
},{timestamps:true})
const User=mongoose.model('user',userschema,'hell1');
module.exports=User;