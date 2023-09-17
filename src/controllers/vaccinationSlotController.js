const vaccinationSlotModel = require("../models/vaccinationSlotModel");
const moment = require("moment")
const createSlot=async(req,res)=>{
    try {
       const slotData=req.body;
       const formattedDate = moment(slotData.date).format("ll")
       slotData.date = formattedDate
       const createdSlot=await vaccinationSlotModel.create(slotData);
       return res.status(200).send({status:true,message:"slot Created successfully",createdSlot});
       
       
    } catch (error) {
       res.status(500).send({status:false,message:"Server Error",error});
    }
}


module.exports=createSlot;