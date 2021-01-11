const express = require("express");
const dotenv = require("dotenv").config();
const cron = require('node-cron');
const cors = require("cors");

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fetching = require("./fetching.js");
const needsLogin = require("./authentication/auth.js")

cron.schedule('0 0 * * *', () => {
    console.log('Running daily data fetching.');
    fetching();
});

app.use("/auth", require("./authentication/routes.js"));
app.use("/combustivel", require("./routes/combustivel.js"));
app.use("/user", needsLogin, require("./routes/user.js"));
app.use("/viagem", needsLogin, require("./routes/viagem.js"))

app.listen(process.env.PORT, () => {
    console.log("Servidor a correr.")
})