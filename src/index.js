const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const route = require("./routes/userRoute");
const admin = require("./routes/adminRoute")

dotenv.config();

const app = express();

app.use(express.json())

// connecting to db
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("mongodb is connected"))
.catch((err) => console.log(err));

app.use("/", route);
app.use("/admin", admin);

app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port", process.env.PORT);
});
