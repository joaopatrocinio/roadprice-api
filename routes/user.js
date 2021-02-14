const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const db = require("../db.js");

router.post("/editarperfil", (req, res) => {
    if (req.body.user_fullname) {
        if (req.body.user_password && req.body.user_old_password) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.user_password, salt);
            db.query("SELECT user_password FROM user WHERE user_id = ?", [req.user.user_id], (err, result) => {
                if (err) return res.status(500).json({ message: 'Ocorreu um erro a identificar o utilizador.' });
                var passwordIsValid = bcrypt.compareSync(req.body.user_old_password, result[0].user_password);
                if (!passwordIsValid) return res.status(403).json({ message: "Password incorreta." })
                db.query("UPDATE user SET user_fullname = ?, user_password = ? WHERE user_id = ?", [req.body.user_fullname, hash, req.user.user_id], (err, result) => {
                    if (err) return res.status(500).json({ message: 'Ocorreu um erro a identificar o utilizador.' });
                    res.json({ message: "Perfil editado com sucesso." })
                })
            })
        } else {
            db.query("UPDATE user SET user_fullname = ? WHERE user_id = ?", [req.body.user_fullname, req.user.user_id], (err, result) => {
                if (err) return res.status(500).json({ message: 'Ocorreu um erro a identificar o utilizador.' });
                res.json({ message: "Perfil editado com sucesso." })
            })
        }
    } else {
        res.status(400).json({ message: "Campos em falta." })
    }
})

module.exports = router;