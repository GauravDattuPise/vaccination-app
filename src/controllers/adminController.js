const userModel = require("../models/userModel")

// get registered users
const getUsers= async(req,res)=>{
     try {
        const fetchUser=await  userModel.find().select({_id:0,password:0,__v:0}).sort({age : 1})
        if(fetchUser.length===0){
          return res.status(404).send({status:false,message:"no any user Register"});
        }
        return res.status(200).send({status:true,message:"User Fetched successfully",fetchUser});

     } catch (error) {
        return res.status(500).send({status:true,message:"Server Error in get User"}); 
     }
}

module.exports={getUsers};