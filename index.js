const express=require("express");
const app=express();
const env=require("dotenv");
const { default: mongoose } = require("mongoose");

env.config();

app.use(express.json({limit: "16kb"})) // we use this so that we can parse json data 
app.use(express.urlencoded({extended: true, limit: "16kb"}))//parese data from url
const DB_NAME=process.env.DB_NAME;





app.get('/',(req,res)=>{
    
    return res.send("hi there");
})
app.listen(process.env.PORT, async()=>{
    console.log(`server started running at : ${process.env.PORT}`);

    try{

        await mongoose.connect(process.env.DB_URL,{
        dbName: DB_NAME,   // 🔑 dynamic DB name
        family: 4,        // Windows DNS fix
        tls: true,

        serverSelectionTimeoutMS: 5000
        
      });
        console.log("mongoDb connected");

    }catch(err){
        console.error("mongoDb failed:", err.message);


    }
})