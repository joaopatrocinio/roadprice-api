const express = require("express");
const dotenv = require("dotenv").config();
const cron = require('node-cron');
const app = express()

const fetching = require("./fetching.js");

cron.schedule('0 0 * * *', () => {
    console.log('Running daily data fetching.');
    fetching();
});

app.use("/", require("./routes.js"));

app.listen(8081, () => {
    console.log("Servidor a correr.")
})