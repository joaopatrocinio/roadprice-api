const express = require("express");
const router = express.Router();

const db = require("../db.js");

router.post("/editarperfil", (req, res) => {
    if (req.body.user_fullname) {
        db.query("UPDATE user SET user_fullname = ? WHERE user_id = ?", [req.body.user_fullname, req.user.user_id], (err, result) => {
            if (err) return res.status(500).json({ message: 'Ocorreu um erro a identificar o utilizador.' });
            res.json({ message: "Perfil editado com sucesso." })
        })
    }
})

module.exports = router;