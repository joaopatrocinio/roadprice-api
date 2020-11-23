const express = require("express");
const moment = require('moment');
const router = express.Router();

const db = require("./db.js");
const combustiveis = [
    "gasolina95simples",
    "gasolina95plus",
    "gasolina98simples",
    "gasolina98plus",
    "gasoleoSimples",
    "gasoleoPlus",
    "gplAuto",
]

router.get("/preco/:combustivel", (req, res) => {
    if (combustiveis.find(c => c == req.params.combustivel)) {
        db.query("SELECT combustivel_tipo, combustivel_preco, combustivel_data FROM combustivel WHERE combustivel_tipo = ? ORDER BY combustivel_data DESC LIMIT 1", [req.params.combustivel], (err, result) => {
            if (err) throw err;
            return res.json({
                tipo: result[0].combustivel_tipo,
                preco: result[0].combustivel_preco,
                data: moment(result[0].combustivel_data).format("YYYY-MM-DD"),
            })
        })
    } else {
        return res.json({
            message: "Tipo de combustível não existe."
        })
    }
})

module.exports = router;