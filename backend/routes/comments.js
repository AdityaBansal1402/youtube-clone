const express=require('express');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Comments=require('../models/comments');
const Video=require('../models/video');
const User = require('../models/user');

router.get('/fetchallcomments/:id',async(req,res)=>{
    try{
        let success=false;
        const video=await Video.findById(req.params.id);
        if(!video){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        const comments=await Comments.find({videoId:video._id}).sort({date:-1})
        success=true;
        res.json({success,comments})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,error: "Internal server error" });
    }
})

router.post('/addcomment/:id', fetchuser,async(req,res)=>{
    const {description}=req.body;
    try{
        let success=false;
        const user=await User.findById(req.user.id);
        console.log(user);
        const comment=new Comments({
            description,userId:req.user.id,videoId:req.params.id,name:user.name
        })
        const savedcomment= await comment.save();
        success=true;
        const video=await Video.findByIdAndUpdate(req.params.id,{
            $push:{comments:savedcomment._id}
        })
        res.json({success,savedcomment,video})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }
})

router.delete('/deletecomment/:vidid/:id', fetchuser,async(req,res)=>{
    try{
        let success=false;
        let comment=await Comments.findById(req.params.id);
        let video=await Video.findById(req.params.vidid)
        if(!comment || !video){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        if(comment.userId.toString()!==req.user.id && video.user.toString()!==req.user.id){
            return res.status(401).send({success,error: "NOT ALLOWED!!"});
        }
        comment=await Comments.findByIdAndDelete(req.params.id);
        video=await Video.findByIdAndUpdate(req.params.vidid,{
            $pull:{comments:comment._id}
        })
        success=true
        res.json({success,note:comment,video:video});
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports=router;