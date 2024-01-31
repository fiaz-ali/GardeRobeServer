const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const connectDB = require("./config/db");

// connect db
// connectDB();

app.get("/", (req, res) => res.send("API is Running"))

//Init Middleware -> this helps the api to fetch the requests
app.use(express.json({ extended: false }))
app.use(cors())
// app.use(bodyParser.json())

// Define routes
app.use("/api/scrap", require('./routes/scrap-route'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));