const express = require("express");
const { registerUser, getSlotDetails, loginUser, vaccinationSlotBokking } = require("../controllers/userController");
const authentication = require("../middlware/authentication");
const router = express.Router();

router.post("/registerUser", registerUser)

router.post("/loginUser", loginUser)

router.get("/getSlotDetails",authentication, getSlotDetails);

// slot booking
router.post("/vaccinationSlotBokking", authentication, vaccinationSlotBokking)

module.exports = router