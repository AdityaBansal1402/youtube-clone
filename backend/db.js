const mongoose=require('mongoose');
// require('dotenv').config()
const dotenv = require("dotenv");  //require dotenv package
dotenv.config({ path: "./.env" });
// dotenv.config();
// console.log(process.env)
const urI=(process.env.MONGO_API_KEY);
const connectto=async()=>{
    await mongoose.connect(urI).then(()=>console.log('connected')).catch(err=>console.log(err));
}
module.exports=connectto;