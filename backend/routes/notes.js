const express = require('express');
const router = express.Router();
const fetchuser =require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Notes=require('../models/some');

router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try{
        let success=false;
        const notes=await Notes.find({user:req.user.id});
        success=true;
        res.json({success,notes})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,error: "Internal server error" });
    }
})

router.get('/fetchnotes/:id',async(req,res)=>{
    try{
        let success=false;
        const notes=await Notes.find({user:req.params.id});
        success=true;
        res.json({success,notes})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ success,error: "Internal server error" });
    }
})

router.post('/addnotes', fetchuser,[
    body('title',"enter a valid Title").isLength({min:5}),
    body('description',"Enter a valid description").isLength({min:10})
],async(req,res)=>{
    const {title,description,tag}=req.body;
    const erro=validationResult(req);
    if(!erro.isEmpty()){
        return res.status(400).json({errors: erro.array()});
    }
    try{
        let success=false;
        const note=new Notes({
            title,description,tag,user:req.user.id
        })
        const savednote= await note.save();
        success=true
        res.json({success,savednote})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }
})

router.put('/updatenote/:id', fetchuser,async(req,res)=>{
    const {title,description,tag}=req.body;
    try{
        let success=false;
        const newnote={};
        if(title){newnote.title= title};
        if(description){newnote.description= description};
        if(tag){newnote.tag= tag};
    
        let note=await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send({success,error: "NOT ALLOWED!!"});
        }
        note =await Notes.findByIdAndUpdate(req.params.id, {$set: newnote}, {new:true})
        success=true
        res.json({success,note})
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }
})


router.delete('/deletenote/:id', fetchuser,async(req,res)=>{
    try{
        let success=false;
        let note=await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send({success,error: "NOT FOUND"});
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send({success,error: "NOT ALLOWED!!"});
        }
        notes=await Notes.findByIdAndDelete(req.params.id);
        success=true
        res.json({success,note:note});
    }catch(error){
        success=false;
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


module.exports=router;