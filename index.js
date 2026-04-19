const express=require("express");
const app=express();
const env=require("dotenv");
const { default: mongoose } = require("mongoose");

env.config();


app.use(express.json({limit: "16kb"})) // we use this so that we can parse json data 
app.use(express.urlencoded({extended: true, limit: "16kb"}))//parese data from url
const DB_NAME=process.env.DB_NAME;
mongoose.set('debug', true);




const MovieRoutes = require('./routes/movie.routes.js');
const theatreRoutes = require('./routes/theatre.routes.js');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookingRoutes = require('./routes/booking.routes');
const showRoutes = require('./routes/show.routes');
const paymentRoutes = require('./routes/payment.routes');
MovieRoutes(app); // invoking movie routes
theatreRoutes(app); // involing theatre routes
authRoutes(app); // invoking auth routes
userRoutes(app); // invoking user routes
bookingRoutes(app); // invoking booking routes
showRoutes(app); // invoking show routes
paymentRoutes(app); // invoking payment routes


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