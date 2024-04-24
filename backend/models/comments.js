const mongoose = require ('mongoose');

const commentsschema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    videoId:{
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
    description:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
},{timestamps:true})
const User=mongoose.model('comments',commentsschema,'hell4');
module.exports=User;