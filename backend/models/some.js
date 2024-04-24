const mongoose = require ('mongoose');


const notesschema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:'general'
    },
    date:{
        type:Date,
        default: Date.now
    },
})

const User=mongoose.model('notes',notesschema,'hell2');
module.exports=User;