const mongoose = require ('mongoose');

const videoschema = new mongoose.Schema({
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
    date: {
        type: Date,
        default: function() {
            // Format the current date using toLocaleString with options
            return new Date().toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            });
        }
    },
    imgurl:{
        type: String,
        required:true
    },
    vidurl:{
        type: String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    comments:{
        type:[String],
        default:[""]
    }
},{timestamps:true})
const User=mongoose.model('video',videoschema,'hell3');
module.exports=User;