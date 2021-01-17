const express = require("express");
const moment = require("moment")
const router = express.Router();

const db = require("../db.js");

router.get("/", (req, res) => {
    db.query("SELECT viagem.*, combustivel.combustivel_preco_medio, combustivel.combustivel_preco_barato, combustivel.combustivel_tipo FROM viagem LEFT JOIN combustivel ON viagem_combustivel_id = combustivel_id WHERE viagem_user_id = ?", [req.user.user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Ocorreu um erro a identificar o utilizador.' });
        res.json(result.map(viagem => {
            viagem.viagem_data = moment(viagem.viagem_data, "YYYY-MM-DD HH:mm:ss").fromNow()
            return viagem
        }))
    })
})

module.exports = router;