import express from "express";
import Settings from "../models/settingModel"

const router= express.Router();

// get 

router.get("/",async(req,res)=>{
try{
 const settings = await settings.findOne();
 res.json(settings||{})
}
catch(error){
  res.status(500).json({error:error.message});
}

// update

router.put("/",async(req,res)=>{
    try{
        const {theme,notification,taskperpage} =req.body;
        let settings = await settings.findOne();
        if(!settings){
            settings = newSettings ({ theme,notification,taskperpage});
        }else{
            settings.theme= theme;
            settings.notification = notification;
            settings.taskperpage = taskperpage;
        }
        await settings.save();
        res.json(settings);
    }
    catch(error){
       res.status(500).json({error:error.message})
    }
})
})