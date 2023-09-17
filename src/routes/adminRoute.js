const express = require("express");
const { getUsers } = require("../controllers/adminController");
const createSlot = require("../controllers/vaccinationSlotController");

const router = express.Router();

router.get("/getUsers",getUsers)
router.post("/createSlot", createSlot)



module.exports = router