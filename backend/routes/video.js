const express=require('express');
const router=express.Router();
const Video=require('../models/video');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const User = require('../models/user');


router.get('/fetchallvideos',fetchuser,async(req,res)=>{
    try{
        let success=false;
        const videos=await Video.find({user:req.user.id});
        success=true;
        res.json({success,videos})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,error: "Internal server error" });
    }
})

router.get('/fetchuservideos/:id',async(req,res)=>{
    try{
        let success=false;
        const videos=await Video.find({user:req.params.id}).sort({date:-1});
        success=true;
        res.json({success,videos})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,error: "Internal server error" });
    }
})

router.get('/fetchvideos/:id',async(req,res)=>{
    try{
        let success=false;
        const videos=await Video.findById(req.params.id);
        if(!videos){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        success=true;
        res.json({success,videos})
    }catch(error){
        const id=req.params.id;
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,id,error: "Internal server error" });
    }
})
router.get('/randomvid',async(req,res)=>{
    try{
        let success=false;
        const videos=await Video.aggregate([{$sample:{size:40}}]);
        if(!videos){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        success=true;
        res.json({success,videos})
    }catch(error){
        let success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,error: "Internal server error" });
    }
})

router.get('/trend',async(req,res)=>{
    try{
        let success=false;
        const videos=await Video.find().sort({views:-1});
        if(!videos){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        success=true;
        res.json({success,videos})
    }catch(error){
        let success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,error: "Internal server error" });
    }
})

router.get('/subvid',fetchuser,async(req,res)=>{
    try{
        let success=false;
        const user= await User.findById(req.user.id);
        const subs=user.subcribedUsers;

        const list= await Promise.all(
            subs.map(channelId=>{
                return Video.find({user:channelId})
            })
        )
        if(!list){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        success=true;
        res.json({success,list})
    }catch(error){
        let success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,error: "Internal server error" });
    }
})


router.post('/uploadvid',fetchuser,[
    body('title',"enter a valid Title").isLength({min:5}),
    body('description',"Enter a valid description").isLength({min:10})
],async(req,res)=>{
    const {title,description,imgurl,vidurl}=req.body;
    const erro=validationResult(req);
    if(!erro.isEmpty()){
        return res.status(400).json({errors: erro.array()});
    }
    try{
        let success=false;
        const video=new Video({
            title,description,imgurl,vidurl,user:req.user.id
        })
        const savedvid= await video.save();
        success=true
        res.json({success,savedvid})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }
})
router.put('/updatevid/:id', fetchuser,async(req,res)=>{
    const {title,description,imgurl,vidurl}=req.body;
    try{
        let success=false;
        const newvideo={};
        if(title){newvideo.title= title};
        if(description){newvideo.description= description};
        if(imgurl){newvideo.imgurl= imgurl};
        if(vidurl){newvideo.vidurl= vidurl};
    
        let video=await Video.findById(req.params.id);
        if(!video){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        if(video.user.toString()!==req.user.id){
            return res.status(401).send({success,error: "NOT ALLOWED!!"});
        }
        video =await Video.findByIdAndUpdate(req.params.id, {$set: newvideo}, {new:true})
        success=true
        res.json({success,video})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }
})
router.put('/view/:id',async(req,res)=>{
    try{
        let success=false;
    
        let video=await Video.findById(req.params.id);
        if(!video){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        video =await Video.findByIdAndUpdate(req.params.id, {$inc: {views:1}}, {new:true})
        success=true
        res.json({success,video})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }
})
// router.put('/like/:id',async(req,res)=>{
//     try{
//         let success=false;
    
//         let video=await Video.findById(req.params.id);
//         if(!video){
//             return res.status(404).send({success,error: "NOT FOUND"});
//         }
//         video =await Video.findByIdAndUpdate(req.params.id, {$inc: {likes:1}}, {new:true})
//         success=true
//         res.json({success,video})
//     }catch(error){
//         success=false;
//         console.error("Error creating user:", error);
//         res.status(500).json({success, error: "Internal server error" });
//     }
// })


router.delete('/deletevid/:id', fetchuser,async(req,res)=>{
    try{
        let success=false;
        let video=await Video.findById(req.params.id);
        if(!video){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        if(video.user.toString()!==req.user.id){
            return res.status(401).send({success,error: "NOT ALLOWED!!"});
        }
        video=await Video.findByIdAndDelete(req.params.id);
        success=true
        res.json({success,video:video});
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


module.exports=router;