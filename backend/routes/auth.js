const express=require('express');
const router=express.Router();
const User=require('../models/user');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const JWT_SECRET="somethingSecysecy";
const fetchuser = require('../middleware/fetchuser');
const Video=require('../models/video')

router.post('/createuser',[
    body('email',"enter a valid email").isEmail(),
    body('name',"Enter a valid name").isLength({min:3}),
    body('password',"your password should be greater than 5 letters").isLength({min:5})
],async (req,res)=>{
    let success=false
    const erro=validationResult(req);
    if(!erro.isEmpty()){
        return res.status(400).json({errors: erro.array()});
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Duplicate email" });
        }
        const salt= await bcrypt.genSalt(10);
        const secpass= await bcrypt.hash( req.body.password,salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpass,
            pic: req.body.pic
        });
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken= await jwt.sign(data,JWT_SECRET);
        success=true
        res.json({success, authtoken});
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }

    // .then(User => res.json(User)).catch(err =>{
    //     console.error("error creating user:",err);
    //     res.status(500).json({error:err});
    // })
    // const user=User(req.body);
    // user.save()
    // res.send('hello')
})


router.post('/login',[
    body('email',"enter a valid email").isEmail(),
    body('password',"password cannot be blank").exists(),
],async (req,res)=>{
    let success=false;
    const erro=validationResult(req);
    if(!erro.isEmpty()){
        return res.status(400).json({errors: erro.array()});
    }
    const{email,password}=req.body;
    try{
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({success,error:"Please enter the correct credentials"});
        }
        const passwordcomp= await bcrypt.compare(password,user.password);
        if(!passwordcomp){
            return res.status(400).json({success,error:"Please enter the correct credentials"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken= await jwt.sign(data,JWT_SECRET);
        success=true;
        // console.log(authtoken);
        res.json({success,authtoken});
    }catch(error){
        console.error("Error loging user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


router.get('/getuser',fetchuser,async (req,res)=>{
    try{
        let success=false;
        let userId=req.user.id;
        const user = await User.findById(userId).select("-password");
        success=true;
        res.send({success,user});
    }catch(error){
        success=false;
        console.error("Error loging user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }

})
router.get('/getsome/:id',async (req,res)=>{
    try{
        let success=false;
        const user = await User.findById(req.params.id).select("-password");
        success=true;
        res.send({success,user});
    }catch(error){
        success=false;
        console.error("Error loging user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }

})

router.put('/subscribe/:id',fetchuser,async (req,res)=>{
    try{
        let success=false;
        let userId=req.user.id;
        const userExists = await User.exists({ _id: userId, subcribedUsers: req.params.id });
        if (userExists) {
            return res.status(400).json({ success, error: "User is already subscribed" });
        }
        const user = await User.findByIdAndUpdate(userId,{
            $push: {subcribedUsers: req.params.id}
        },{new:true});
        const user2 = await User.findByIdAndUpdate(req.params.id,{
            $inc: {subscribers:1}
        },{new:true});
        success=true;
        res.send({success,user,user2});
    }catch(error){
        console.error("Error loging user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }

})

router.get('/issub/:id',fetchuser,async (req,res)=>{
    try{
        let success=false;
        let userId=req.user.id;
        const userExists = await User.exists({ _id: userId, subcribedUsers: req.params.id });
        if (userExists) {
            return res.send(true);
        }
        success=true;
        res.send(false);
    }catch(error){
        success=false;
        console.error("Error loging user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }

})

router.put('/unsubscribe/:id',fetchuser,async (req,res)=>{
    try{
        let success=false;
        let userId=req.user.id;
        const userExists = await User.exists({ _id: userId, subcribedUsers: req.params.id });
        if (!userExists) {
            return res.status(400).json({ success, error: "User is not subscribed" });
        }
        const user = await User.findByIdAndUpdate(userId,{
            $pull: {subcribedUsers: req.params.id}
        },{new:true});
        const user2 = await User.findByIdAndUpdate(req.params.id,{
            $inc: {subscribers:-1}
        },{new:true});
        success=true;
        res.send({success,user,user2});
    }catch(error){
        console.error("Error loging user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }

})

router.put('/likevid/:id',fetchuser,async (req,res)=>{
    try{
        let success=false;
        let userId=req.user.id;
        const userExists = await User.exists({ _id: userId, likedvids: req.params.id });
        if (userExists) {
            return res.status(400).json({ success, error: "User already liked" });
        }
        const user = await User.findByIdAndUpdate(userId,{
            $push: {likedvids: req.params.id}
        },{new:true});
        const user2 = await Video.findByIdAndUpdate(req.params.id,{
            $inc: {likes:1}
        },{new:true});
        success=true;
        res.send({success,user,user2});
    }catch(error){
        success=false;
        console.error("Error loging user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }

})

router.put('/dislikevid/:id',fetchuser,async (req,res)=>{
    try{
        let success=false;
        let userId=req.user.id;
        const userExists = await User.exists({ _id: userId, likedvids: req.params.id });
        if (!userExists) {
            return res.status(400).json({ success, error: "User not liked" });
        }
        const user = await User.findByIdAndUpdate(userId,{
            $pull: {likedvids: req.params.id}
        },{new:true});
        const user2 = await Video.findByIdAndUpdate(req.params.id,{
            $inc: {likes:-1}
        },{new:true});
        success=true;
        res.send({success,user,user2});
    }catch(error){
        success=false;
        console.error("Error loging user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }

})

router.get('/islikevid/:id',fetchuser,async (req,res)=>{
    try{
        let success=false;
        let userId=req.user.id;
        const userExists = await User.exists({ _id: userId, likedvids: req.params.id });
        if (userExists) {
            return res.send(true);
        }
        success=true;
        res.send(false);
    }catch(error){
        success=false;
        console.error("Error loging user:", error);
        res.status(500).json({success, error: "Internal server error" });
    }

})

// router.put('/unlikevid/:id',fetchuser,async (req,res)=>{
//     try{
//         let success=false;
//         let userId=req.user.id;
//         const userExists = await User.exists({ _id: userId, likedvids: req.params.id });
//         if (userExists) {
//             return res.status(400).json({ success, error: "User already liked" });
//         }
//         const user = await User.findByIdAndUpdate(userId,{
//             $push: {likedvids: req.params.id}
//         },{new:true});
//         const user2 = await Video.findByIdAndUpdate(req.params.id,{
//             $inc: {likes:1}
//         },{new:true});
//         success=true;
//         res.send({success,user,user2});
//     }catch(error){
//         success=false;
//         console.error("Error loging user:", error);
//         res.status(500).json({success, error: "Internal server error" });
//     }

// })

// router.put('/ununlikevid/:id',fetchuser,async (req,res)=>{
//     try{
//         let success=false;
//         let userId=req.user.id;
//         const userExists = await User.exists({ _id: userId, likedvids: req.params.id });
//         if (!userExists) {
//             return res.status(400).json({ success, error: "User not liked" });
//         }
//         const user = await User.findByIdAndUpdate(userId,{
//             $pull: {likedvids: req.params.id}
//         },{new:true});
//         const user2 = await Video.findByIdAndUpdate(req.params.id,{
//             $inc: {likes:-1}
//         },{new:true});
//         success=true;
//         res.send({success,user,user2});
//     }catch(error){
//         success=false;
//         console.error("Error loging user:", error);
//         res.status(500).json({success, error: "Internal server error" });
//     }

// })

// router.get('/isunlikevid/:id',fetchuser,async (req,res)=>{
//     try{
//         let success=false;
//         let userId=req.user.id;
//         const userExists = await User.exists({ _id: userId, likedvids: req.params.id });
//         if (userExists) {
//             return res.send(true);
//         }
//         success=true;
//         res.send(false);
//     }catch(error){
//         success=false;
//         console.error("Error loging user:", error);
//         res.status(500).json({success, error: "Internal server error" });
//     }

// })


module.exports=router;