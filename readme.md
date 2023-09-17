# Vaccine Registration App

## Overview

The Vaccine Registration App is a Node.js application that simplifies the process of registering for COVID-19 vaccinations. It provides a user-friendly interface for users to register, manage their appointments, and offers admin capabilities for overseeing registrations.

## Key Features

### User Registration and Login

- Users can create accounts by providing mandatory information, including Name, PhoneNumber, Age, Pincode, and Aadhar No.
- Secure user login using PhoneNumber and a password set during registration.

### Vaccine Slot Availability

- Users can view the available time slots for vaccine registration on a given day.
- The available slots are based on the user's vaccination status (first or second dose).

### Slot Registration

- Users can register for vaccine slots, specifying whether it's their first or second dose.
- Each vaccine slot has a 30-minute duration, with a maximum of 10 available doses.
- Once a slot is fully booked, it becomes unavailable for further registrations.

### Second Dose Registration

- Users can register for the second dose only after completing their first dose of the vaccine.

### Slot Modification

- Users can update or change their registered slot, as long as it's done 24 hours prior to the registered slot time.

### Admin Access

- Admins can log in using credentials manually created in the database.
- Admins have access to a dashboard with features to monitor user registrations.

### User Filtering

- Admins can check the total number of registered users and filter them based on Age, Pincode, and Vaccination status (None, First dose completed, All completed).

### Vaccine Slot Details

- Information about the available vaccine slots, including dates, time slots, and available doses, is accessible.

### Vaccination Drive Schedule

- The vaccination drive is scheduled from 18 sep 2023 to 18 oct 2023
- Vaccination timings are from 10 AM to 5 PM daily.
- Slots are available at 30-minute intervals.

## Usage

1. Users create accounts and log in to the application.
2. Users view available vaccine slots, select their desired slot, and register.
3. Admins log in to the admin panel to monitor registrations and manage user data.

