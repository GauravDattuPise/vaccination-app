const schedule = require('node-schedule');
const moment = require('moment');

const scheduleStatusUpdate = (slotTime, phoneNumber) => {

    const fiveMinutesFromNow = moment().add(10, 'seconds').toDate();

  const job = schedule.scheduleJob(fiveMinutesFromNow, async () => {
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
