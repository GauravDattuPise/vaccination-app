const vaccinationSlotModel = require("../models/vaccinationSlotModel");
const moment = require("moment")

// creating slots for vaccination

const createSlot=async(req,res)=>{
    try {
       const slotData=req.body;

       // changing the format of date
       const formattedDate = moment(slotData.date).format("ll")
       slotData.date = formattedDate

       // saving slot details
       const createdSlot=await vaccinationSlotModel.create(slotData);
       return res.status(200).send({status:true,message:"slot Created successfully",createdSlot});
       
       
    } catch (error) {
       res.status(500).send({status:false,message:"Server Error",error});
    }
}


module.exports=createSlot;