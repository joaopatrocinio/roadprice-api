const express = require("express");
const dotenv = require("dotenv").config();
const cron = require('node-cron');
const cors = require("cors");

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const fetching = require("./fetching.js");

cron.schedule('0 0 * * *', () => {
    console.log('Running daily data fetching.');
    fetching();
});

app.use("/combustivel", require("./routes/combustivel.js"));
app.use("/auth", require("./routes/auth.js"));

app.listen(process.env.PORT, () => {
    console.log("Servidor a correr.")
})