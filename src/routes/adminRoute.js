const express = require("express");
const { getUsers } = require("../controllers/adminController");
const createSlot = require("../controllers/vaccinationSlotController");

const router = express.Router();

// ADMIN APIS

// get users
router.get("/getUsers",getUsers)

// create slot for vaccination
router.post("/createSlot", createSlot)

module.exports = router