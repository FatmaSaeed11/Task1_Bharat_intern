//import modules
const express=require('express');
const mongoose=require('mongoose');
const bodyparser=require("body-parser");
const dotenv=require('dotenv');

// init app & middleware
const app=express();
dotenv.config();

//init port
const port=process.env.PORT||8087;

// conect to db
const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;


mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.p7tj4iq.mongodb.net/registrationFormDB`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

// registration schema
const registrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

// model registration schema
const Registration=mongoose.model("Registration",registrationSchema);

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

//routes
app.get("/",(req,res)=>{
    res.sendFile(__dirname +"/pages/index.html");
});
const path = require('path');
const filePath = path.join(__dirname, 'pages', 'index.html');
console.log('File path:', filePath);

//register and check if user already exists or not
app.post("/register",async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        
        const existingUser=await Registration.findOne({ email:email});
        if(!existingUser){
            const registrationData=new Registration({
                name,
                email,
                password
            });
           await registrationData.save();
           res.redirect("/success");
        }
        else{
            alert("user already exists");
            res.redirect("/error");
        }      
    }
    catch(error){
        console.log(error);
        res.redirect("error");
    }
})
//success
app.get("/success",(req,res)=>{
    res.sendFile(__dirname +"/pages/success.html");

})
//error
app.get("/error",(req,res)=>{
    res.sendFile(__dirname +"/pages/error.html");

})
// check local host is run
app.listen(port,()=>{
    console.log('our port is ',port);
})