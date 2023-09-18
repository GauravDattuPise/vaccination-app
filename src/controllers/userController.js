const userModel = require("../models/userModel");
const vaccinationSlotModel = require("../models/vaccinationSlotModel");
const moment = require("moment");
const schedule = require('node-schedule');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        const { name, phoneNumber, password, age, aadhaarNo } = userData

        if (!name) { return res.status(400).send({ status: false, message: "Name is mandatory" }) }
        if (!phoneNumber) { return res.status(400).send({ status: false, message: "phoneNumber is mandatory" }) }
        if (!password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }
        if (!age) { return res.status(400).send({ status: false, message: "age is mandatory" }) }
        if (!aadhaarNo) { return res.status(400).send({ status: false, message: "aadhaarNo is mandatory" }) }
       

        const newPhoneNo = String(phoneNumber);
        if(newPhoneNo.length !== 10){
            return res.status(400).send({status : false, message : "phone number is invalid (length should be 10)"})
        }

        const newAadhaarNo = String(aadhaarNo);
        if(newAadhaarNo.length !== 12){
            return res.status(400).send({status : false, message : "Aadhaar number is invalid (length should be 12)"})
        }

       const existingPhoneNumber = await userModel.findOne({phoneNumber})
       if(existingPhoneNumber){
        return res.status(409).send({status : false, message : "phone number already registerd"})
       }

       const existingAadhaarNo = await userModel.findOne({aadhaarNo})
       if(existingAadhaarNo){
        return res.status(409).send({status : false, message : "aadhaar number already in use"})
       }
       
        userData.password = await bcrypt.hash(password, 10);
        const registeredUser = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "User registered successfully", registeredUser })

    } catch (error) {
        return res.status(500).send({ status: false, message: "server error in register user", error })
    }
}

// login user
const loginUser = async (req, res) => {
    try {
        const userData = req.body;
        const { phoneNumber, password } = userData
        if (!phoneNumber) { return res.status(400).send({ status: false, message: "phoneNumber is mandatory" }) }
        if (!password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }

        const findUser = await userModel.findOne({ phoneNumber })

        if (!findUser) {
            return res.status(404).send({ status: false, message: " User not found" });
        }
        const matchPassword = await bcrypt.compare(password, findUser.password);
        if (!matchPassword) {
            return res.status(400).send({ status: false, message: "Invalid Password" });
        }
        const token = jwt.sign({ phoneNumber }, "my-secret-key", { expiresIn: "10h" });
        res.setHeader("token", token)
        return res.status(200).send({ status: true, message: "Token is SuccessFully Generated" });

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: "server error in Login user", error })

    }
}


const getSlotDetails = async (req, res) => {
    try {
        console.log("heloo")
        let slotData = req.body
        let { date } = slotData;
        const formattedDate = moment(date).format("ll")
        const slotDetails = await vaccinationSlotModel.find({ date: formattedDate }).select({ _id: 0, __v: 0 });
        return res.status(200).send({ status: true, message: "Available slots", slotDetails });

    } catch (error) {
        return res.status(500).send({ status: false, message: "server error in get Slots Details", error })
    }
}

// vaccination slot booking
const vaccinationSlotBooking = async (req, res) => {
    try {
        // getting data for vaccination slot booking
        let slotData = req.body;
        let { date, timeSlot } = slotData;
        const phoneNumber = req.phoneNumber;

        const formattedDate = moment(date).format("ll")
        const timeParts = timeSlot.split(" to ");
        const endTime = timeParts[1];
        const concatenatedDate = date + " " + endTime;
        const localMoment = moment(concatenatedDate, "YYYY-MM-DD hh:mm A");

        const utcMoment = localMoment.utc();
        const currentTime = moment.utc();
        const timeLeft = moment.duration(utcMoment.diff(currentTime));

        let minutesLeft = timeLeft.asMinutes();
        minutesLeft = parseInt(minutesLeft)

        // doses availbale in slot or not
        const bookedSlot = await vaccinationSlotModel.findOne({ timeSlot, date: formattedDate })
        if (!bookedSlot) {
            return res.status(404).send({ status: false, message: "slot not found" });
        }

        if (bookedSlot.availableDoses < 1) {
            return res.status(400).send({ status: false, message: "Dose not availabe for this slot" });
        }

        // user vaccination status         
        const userVaccinationStatus = await userModel.findOne({ phoneNumber })

        if (userVaccinationStatus.doseCompleted === 2) {
            return res.status(400).send({ status: false, message: "Your all (2) doses are completed" });
        }


        // function for update status of user after delay elapsed
        const scheduleStatusUpdate = async (minutesLeft) => {

            const updateDbAfterTime = moment().add(minutesLeft, 'minutes').toDate();

            schedule.scheduleJob(updateDbAfterTime, async () => {
                try {
                    userVaccinationStatus.doseCompleted += 1
                    await userVaccinationStatus.save();

                } catch (error) {
                    console.error('Error updating user status:', error);
                }
            });
        };


        if ((userVaccinationStatus.doseCompleted === 0)) {
            bookedSlot.availableDoses -= 1
            await bookedSlot.save();

            // Schedule the status update user vaccination status
            scheduleStatusUpdate(minutesLeft);

            return res.status(200).send({ status: true, message: `Your slot booked for your first dose at ${timeSlot} on ${formattedDate}` });

        }

        if ((userVaccinationStatus.doseCompleted === 1)) {
            bookedSlot.availableDoses -= 1
            await bookedSlot.save();

            // Schedule the status update user vaccination status

            scheduleStatusUpdate(minutesLeft);
            return res.status(200).send({ status: true, message: `Your slot booked for your second dose at ${timeSlot} on ${formattedDate}` });

        }





    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: "server error in Booked Slots for vaccination", error })
    }
}

//=======================================================================================================


// to change vaccination slot first we need slot objectId
// get the details of that user vaccination status
// get the how much time remained to taken vaccine (if time < 24 hours ) then dont allow to change time && only future date update
// get from req.body (date or timeSlot or both to update) and increment available slots

const changeVaccinationSlot = async (req, res) => {
    try {

        // slot objectId from database
        const { slotId } = req.params

        const {date, timeSlot} = req.body

        const findSlot = await vaccinationSlotModel.findById(slotId);

        const currentTime = new Date();
        let dbDate = findSlot.date
        console.log("currentTime",currentTime);

        // Define the date string
        const dateString = dbDate;

        // Split the date string into parts
        const parts = dateString.split(' ');

        // Define a mapping of month abbreviations to month numbers
        const monthAbbreviations = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };

        // Extract month, day, and year from the parts
        const month = monthAbbreviations[parts[0]];
        const day = parseInt(parts[1].replace(',', ''), 10);
        const year = parseInt(parts[2], 10);

        // Create a JavaScript Date object
        const date1 = new Date(year, month, day);

        console.log("date",date1);


        // Calculate the difference in milliseconds
        const differenceMs = currentTime.getTime() - date1.getTime();

        // Convert milliseconds to days
        const differenceHours = Math.floor(differenceMs / (1000 * 60 * 60));
        
        if(differenceHours < 24){
            return res.status(400).send({status : false, message : "cant change vaccination slot before 24 hour to take dose"})
        }

        await vaccinationSlotModel.updateOne(slotId, {$set : {timeSlot : timeSlot, date : date}})

        return res.status(200).send({ status: true, message: "slot changed successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: "server error in change Slots for vaccination", error })
    }
}

module.exports = { registerUser, loginUser, getSlotDetails, vaccinationSlotBooking, changeVaccinationSlot }



