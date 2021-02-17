const express = require("express");
const moment = require("moment")
moment.locale("pt")
const router = express.Router();

const db = require("../db.js");

router.get("/", (req, res) => {
    db.query("SELECT viagem.*, combustivel.combustivel_preco_medio, combustivel.combustivel_preco_barato, combustivel.combustivel_tipo FROM viagem LEFT JOIN combustivel ON viagem_combustivel_id = combustivel_id WHERE viagem_user_id = ? ORDER BY viagem_data DESC", [req.user.user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Ocorreu um erro a identificar o utilizador.' });
        res.json(result.map(viagem => {
            viagem.viagem_data = moment(viagem.viagem_data, "YYYY-MM-DD HH:mm:ss").fromNow()
            return viagem
        }))
    })
})

router.get("/:id", (req, res) => {
    db.query("SELECT viagem.*, combustivel.combustivel_preco_medio, combustivel.combustivel_preco_barato, combustivel.combustivel_tipo FROM viagem LEFT JOIN combustivel ON viagem_combustivel_id = combustivel_id WHERE viagem_user_id = ? AND viagem_id = ?", [req.user.user_id, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Ocorreu um erro a identificar o utilizador.' });
        if (result.length > 0) {
            res.json(result.map(viagem => {
                viagem.viagem_data = moment(viagem.viagem_data, "YYYY-MM-DD HH:mm:ss").fromNow()
                return viagem
            })[0])
        } else {
            res.status(404).json({ message: "Viagem não disponível." })
        }
    })
})

router.post("/", (req, res) => {
    if (
        !req.body.viagem_titulo ||
        !req.body.viagem_combustivel_id ||
        !req.body.viagem_distancia ||
        !req.body.viagem_pessoas ||
        !req.body.viagem_preco_final ||
        !req.body.viagem_preco_pessoa ||
        !req.body.viagem_preco_final_diferenca ||
        !req.body.viagem_preco_pessoa_diferenca ||
        !req.body.viagem_consumo
    ) {
        return res.status(401).json({ message: "Campos em falta." });
    } else {
        db.query("INSERT INTO viagem (viagem_user_id, viagem_combustivel_id, viagem_titulo, viagem_data, viagem_distancia, viagem_pessoas, viagem_preco_final, viagem_preco_pessoa, viagem_preco_final_diferenca, viagem_preco_pessoa_diferenca, viagem_consumo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            req.user.user_id,
            req.body.viagem_combustivel_id,
            req.body.viagem_titulo,
            moment().format("YYYY-MM-DD HH:mm:ss"),
            req.body.viagem_distancia,
            req.body.viagem_pessoas,
            req.body.viagem_preco_final,
            req.body.viagem_preco_pessoa,
            req.body.viagem_preco_final_diferenca,
            req.body.viagem_preco_pessoa_diferenca,
            req.body.viagem_consumo
        ], (err, result) => {
            if (err) return res.status(500).json({ message: "Ocorreu um erro na base de dados.", err: err });
            return res.json({
                message: "Viagem guardada com sucesso.",
                token: result.insertId
            })
        })
    }
})

router.delete("/:id", (req, res) => {
    db.query("DELETE FROM viagem WHERE viagem_id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: "Ocorreu um erro na base de dados.", err: err });
        if (result.affectedRows > 0) {
            return res.json({
                message: "Viagem eliminada com sucesso.",
            })
        } else {
            return res.status(404).json({
                message: "Viagem não encontrada.",
            })
        }
    })
})

module.exports = router;