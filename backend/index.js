const connectto =  require('./db');
const express = require('express');
var cors = require('cors')
const app =express();
const port=process.env.PORT;
connectto();
// app.get('/',(req,res)=>{
//     res.send();
// })
app.use(cors())
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.use('/api/video',require('./routes/video'))
app.use('/api/comments',require('./routes/comments'))
app.listen(port, ()=>{
    console.log(`listening`);
})