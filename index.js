const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const DB_URL = "mongodb+srv://kevlu021:Niveksiemosewa123$@acmtest.oz7ygqy.mongodb.net/test";
const Event = require("./api.js");
mongoose.connect(
  DB_URL
);

const app = express();

app.use(cors());
app.use(express.json());

//Pagination
app.get('/api/events', async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 25;
    const skip = (page - 1) * limit;
    const events = await Event.find().skip(skip).limit(limit);
    console.log(`page is: ${page}`);
    res.json({page: page, events: events});
})
app.listen(4000, () => {
  console.log("server is running on port 4000");
});