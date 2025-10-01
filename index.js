const express =require ("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://meena20040:kums20@cluster0.v61yjgl.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("connected to database..");
    
}).catch(function(){
    console.log("Failed to connect");
    
})
const credential = mongoose.model("credential",{},"bmail")
 app.post("/sendbmail",function(req, res){

         var msg = req.body.msg
         var emailList = req.body.emailList

credential.find().then(function(data){
    
    const transporter = nodemailer.createTransport({
    service:"gmail",
 auth: {
    user: data[0].toJSON().user,
    pass: data[0].toJSON().pass,
  },
});

 new Promise(async function(resolve,reject){

 try{
  for(var i=0; i<emailList.length; i++){

      await transporter.sendMail(
    {
        from:"meenakshidec20@gmail.com",
        to:emailList[i],
        subject:"A message from bmail",
        text: msg
    })
    console.log("Email sent to:" +emailList[i]);
    
}

        resolve("success")
         }
         catch(error)
         {
            
            reject("failed")
            
         }
         }).then(function(){
            res.send(true)
         }).catch(function(){
            res.send(false)
         })

}).catch( function(error){
    console.log(error)
    
})

        
         })

        
const PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
    console.log("Server Started...");
    
})