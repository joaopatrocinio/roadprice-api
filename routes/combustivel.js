const express = require("express");
const moment = require('moment');
const router = express.Router();

const db = require("../db.js");
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
        db.query("SELECT combustivel_id, combustivel_tipo, combustivel_preco_medio, combustivel_preco_barato, combustivel_data FROM combustivel WHERE combustivel_tipo = ? ORDER BY combustivel_data DESC LIMIT 1", [req.params.combustivel], (err, result) => {
            if (err) throw err;
            return res.json({
                combustivel_id: result[0].combustivel_id,
                tipo: result[0].combustivel_tipo,
                preco_medio: result[0].combustivel_preco_medio,
                preco_barato: result[0].combustivel_preco_barato,
                data: moment(result[0].combustivel_data).format("YYYY-MM-DD"),
            })
        })
    } else {
        return res.json({
            message: "Tipo de combustível não existe."
        })
    }
})

router.get("/id/:id", (req, res) => {
    db.query("SELECT combustivel_id, combustivel_tipo, combustivel_preco_medio, combustivel_preco_barato, combustivel_data FROM combustivel WHERE combustivel_id = ? ORDER BY combustivel_data DESC LIMIT 1", [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            return res.json({
                combustivel_id: result[0].combustivel_id,
                tipo: result[0].combustivel_tipo,
                preco_medio: result[0].combustivel_preco_medio,
                preco_barato: result[0].combustivel_preco_barato,
                data: moment(result[0].combustivel_data).format("YYYY-MM-DD"),
            })
        } else {
            return res.json({
                message: "Tipo de combustível não existe."
            })
        }
    })
})

module.exports = router;