const schedule = require('node-schedule');
const moment = require('moment');

const scheduleStatusUpdate = (slotTime, phoneNumber) => {

    const updateDbAfterTime = moment().add(10, 'seconds').toDate();

  const job = schedule.scheduleJob(updateDbAfterTime, async () => {
    try {
      // ... (Your status update logic)

      console.log('User status updated after 1 minutes.');
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  });
};

// Example usage:
const phoneNumber = '1234567890'; 
const slotTime = '2023-09-17T15:00:00'; 

// Schedule the status update after 1 minutes
scheduleStatusUpdate(slotTime, phoneNumber);

//===============================================================================================

const timeRange = "10:30AM to 08:30PM";
const timeParts = timeRange.split(" to ");

// Get the end time (second part)
const endTime = timeParts[1];

const date = "2023-09-25";

const concatenatedDate = date + " " + endTime;

// Create a Moment.js object from the date string
const localMoment = moment(concatenatedDate, "YYYY-MM-DD hh:mm A");

// Convert the local Moment.js object to UTC
const utcMoment = localMoment.utc();

// Calculate the time left
const currentTime = moment.utc();
const timeLeft = moment.duration(utcMoment.diff(currentTime));

// Get the time left in minutes
const minutesLeft = timeLeft.asMinutes();

console.log("UTC Date:", utcMoment.format());
console.log("Time Left (Minutes):", minutesLeft);
