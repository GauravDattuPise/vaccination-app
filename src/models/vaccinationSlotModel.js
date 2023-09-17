const mongoose = require('mongoose');

const vaccineSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  availableDoses: {
    type: Number,
    // required: true,
    default : 10
  },
  totalDoses: {
    type: Number,
    default : 10

  },
});

module.exports = mongoose.model('VaccineSlot', vaccineSlotSchema);
