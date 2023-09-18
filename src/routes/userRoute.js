const express = require("express");
const { registerUser, getSlotDetails, loginUser, vaccinationSlotBooking, changeVaccinationSlot } = require("../controllers/userController");
const authentication = require("../middlware/authentication");
const router = express.Router();

// user registration
router.post("/registerUser", registerUser)

// user login
router.post("/loginUser", loginUser)

// getting slot details
router.get("/getSlotDetails",authentication, getSlotDetails);

// slot booking
router.post("/vaccinationSlotBokking", authentication, vaccinationSlotBooking)

// slot changing
router.put("/changeVaccinationSlot/:slotId", changeVaccinationSlot)

module.exports = router