# Vaccine Registration App

## Overview

The Vaccine Registration App is a Node.js application that simplifies the process of registering for COVID-19 vaccinations. It provides a user-friendly interface for users to register, manage their appointments, and offers admin capabilities for overseeing registrations.

## Key Features

### User Registration

- Users can create accounts by providing mandatory information, including Name, PhoneNumber, Age, Pincode, and Aadhar No.
#### https://vaccination-app-service1.onrender.com/registerUser (post)
{
    "name" : "Rohit Madane",
    "phoneNumber" :7894564564,
    "age" : 22,
    "password" : "Rohit123@",
    "aadhaarNo" : 891157894565
}

### User Login

- Secure user login using PhoneNumber and a password set during registration.
#### https://vaccination-app-service1.onrender.com/loginUser (post)
{
   "phoneNumber" :7894564564,
    "password" : "Rohit123@"
}

### Vaccine Slot Availability

- Users can view the available time slots for vaccine registration on a given day.
- The available slots are based on the user's vaccination status (first or second dose).
#### https://vaccination-app-service1.onrender.com/getSlotDetails (post)
{
    "date": "2023/09/17"
}

### Slot Registration

- Users can register for vaccine slots
- Each vaccine slot has a 30-minute duration, with a maximum of 10 available doses.
- Once a slot is fully booked, it becomes unavailable for further registrations.
- Users can register for the second dose only after completing their first dose of the vaccine.
#### https://vaccination-app-service1.onrender.com/vaccinationSlotBokking (POST)
{
       "date": "2023/9/18",
       "timeSlot": "10:00 AM to 10:30 AM"
}

### Slot Modification

- Users can update or change their registered slot, as long as it's done 24 hours prior to the registered slot time.

### Admin Access

- Admins can log in using credentials manually created in the database.
- Admins have access to a dashboard with features to monitor user registrations.
#### https://vaccination-app-service1.onrender.com/admin/getUsers (get)

### Vaccination Drive Schedule

- The vaccination drive is scheduled from 18 sep 2023 to 18 oct 2023
- Vaccination timings are from 10 AM to 5 PM daily.
- Slots are available at 30-minute intervals.


###  mongodb+srv://gauravpise87:Gaurav2001@gauravdb.crgpvot.mongodb.net/Vaccination_App

