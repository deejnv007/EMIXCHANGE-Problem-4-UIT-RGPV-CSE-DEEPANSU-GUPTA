const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const myToken=process.env.MYTOKEN;

app.listen(3000||process.env.PORT, ()=>{
   console.log("server running successfully!");
});

app.get("/webhook", (req,res)=>{
   const mode = req.query["hub.mode"];
   const challenge = req.query["hub.challenge"];
   const token = req.query["hub.verify_token"];


    if(mode && token){

        if(mode==="subscribe" && token===myToken){
            res.status(200).send(challenge);
        }
        else{
            res.status(403);
        }
    }
});

app.post("/webhook",(req,res)=>{
    let body_param=req.body;
    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry &&
             body_param.entry[0].changes &&
             body_param.entry[0].changes[0].value.messages &&
             body_param.entry[0].changes[0].value.messages[0]
             ){
                let phone_no_id=body_param.entry[0].changes[0].value.metadata.phone_no_id;
                let from=body_param.entry[0].changes[0].messages[0].from;
                let msg_body=body_param.entry[0].value.messages[0].text.body;

                console.log("Phone number: "+phone_no_id);
                console.log("from: "+from);
                console.log("body param: "+msg_body);

                axios({
                    method:"POST",
                    url:"https://graph.facebook.com/v15.0/"+phone_no_id+"/messages?access_token="+token,
                    data:{
                        messaging_product:"whatsapp",
                        to:from,
                        text:{
                            body:"Hey! i'm Deepansu, your message "+msg_body
                        }
                    },
                    headers:{
                        "Content-Type":"application/json"
                    }
                });

                res.sendStatus(200);

             }else{
                res.sendStatus(404); 
             }
    }
});

app.get("/",(req,res)=>{
    res.status(200).send("Hii,this is server setup!");
})