const userModel = require("../models/userModel");
const vaccinationSlotModel = require("../models/vaccinationSlotModel");
const moment = require("moment");
const schedule = require('node-schedule');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req,res) => {
    try {
        const userData = req.body;
        const {name, phoneNumber, password, age, aadhaarNo } = userData

        if(!name){return res.status(400).send({status : false, message : "Name is mandatory"})}
        if(!phoneNumber){return res.status(400).send({status : false, message : "phoneNumber is mandatory"})}
        if(!password){return res.status(400).send({status : false, message : "password is mandatory"})}
        if(!age){return res.status(400).send({status : false, message : "age is mandatory"})}
        if(!aadhaarNo){return res.status(400).send({status : false, message : "aadhaarNo is mandatory"})}
        userData.password = await bcrypt.hash(password, 10);
        const registeredUser = await userModel.create(userData);
        return res.status(201).send({status : true, message : "User registered successfully", registeredUser})
        
    } catch (error) {
        return res.status(500).send({status : false, message : "server error in register user", error })
    }
}

// login user
const loginUser=async(req,res)=>{
    try {
        const userData = req.body;
        const {phoneNumber, password} = userData 
        if(!phoneNumber){return res.status(400).send({status : false, message : "phoneNumber is mandatory"})}
        if(!password){return res.status(400).send({status : false, message : "password is mandatory"})}

        const findUser= await userModel.findOne({phoneNumber})

        if(!findUser){
            return res.status(404).send({status : false, message : " User not found"})  ; 
        }
        const matchPassword= await bcrypt.compare(password,findUser.password);
        if(!matchPassword){
            return res.status(400).send({status : false, message : "Invalid Password"});
        }
         const token=jwt.sign({phoneNumber},"my-secret-key",{expiresIn:"10h"});
          res.setHeader("token",token)
        return res.status(200).send({status:true, message:"Token is SuccessFully Generated"});
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({status : false, message : "server error in Login user", error })
        
    }
}


const getSlotDetails= async(req,res)=>{
    try {
        console.log("heloo")
       let slotData= req.body
       let {date}=slotData ;
       const formattedDate = moment(date).format("ll")
       const slotDetails=await vaccinationSlotModel.find({date:formattedDate}).select({_id:0,__v:0});
       return res.status(200).send({status:true, message:"Available slots",slotDetails});

    } catch (error) {
        return res.status(500).send({status : false, message : "server error in get Slots Details", error })     
    }
}

// vaccination slot booking
const vaccinationSlotBokking = async(req,res)=>{
    try {
        // getting data for vaccination slot booking
        let slotData=req.body;
        let {date, timeSlot}=slotData;

        const formattedDate = moment(date).format("ll")
    
        const phoneNumber = req.phoneNumber;

        // doses availbale in slot or not
        const bookedSlot=await vaccinationSlotModel.findOne({timeSlot, date : formattedDate})
        if(!bookedSlot){
            return res.status(404).send({status:false, message:"slot not found"});

        }
        console.log(bookedSlot)
      
        if(bookedSlot.availableDoses<1){
            return res.status(400).send({status:false, message:"Dose not availabe for this slot"});
        }

        // user vaccination status         
        const userVaccinationStatus = await userModel.findOne({phoneNumber})

        if(userVaccinationStatus.doseCompleted === 2){
            return res.status(400).send({status : false, message : "Your all (2) doses are completed"});             
        }

        if((userVaccinationStatus.doseCompleted === 0)){
             bookedSlot.availableDoses -= 1
             await bookedSlot.save();

             userVaccinationStatus.doseCompleted += 1
             await userVaccinationStatus.save();
             
             let noOfBookSlotAvailable = bookedSlot.availableDoses
             return res.status(200).send({status : true, message : `Your slot booked for your first dose at ${timeSlot} on ${formattedDate} and avaible doses for this slot are ${noOfBookSlotAvailable}`});            

        }

        if((userVaccinationStatus.doseCompleted === 1)){
            bookedSlot.availableDoses -= 1
            await bookedSlot.save();

            userVaccinationStatus.doseCompleted += 1
            await userVaccinationStatus.save();
            
            return res.status(200).send({status : true, message : `Your slot booked for your second dose at ${timeSlot} on ${formattedDate}`});             

        }


    } catch (error) {
        console.log(error)
        return res.status(500).send({status : false, message : "server error in Booked Slots for vaccination", error })
        
    }
}





module.exports = {registerUser, loginUser, getSlotDetails, vaccinationSlotBokking}