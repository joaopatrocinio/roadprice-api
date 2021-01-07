const express = require("express");
const moment = require('moment');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require("../db.js");

router.post('/login', (req, res) => {
    if (req.body.user_email && req.body.user_password) {
        db.query('SELECT * from user WHERE user_email = ?', [req.body.user_email], (err, result) => {
            if (!result[0]) {
                return res.status(401).json({ message: 'Autenteicação falhada, credenciais incorretas.' });
            }
            var passwordIsValid = bcrypt.compareSync(req.body.user_password, result[0].user_password);
            if (!passwordIsValid) {
                return res.status(401).json({ response: 'Autenteicação falhada, credenciais incorretas.' });
            }
            var token = jwt.sign({
                id: result[0].user_id,
            }, process.env.JWT_SECRET, {
                expiresIn: 6064800 // expires in 1 week
            });

            res.status(200).json({
                message: 'Autenticado com sucesso.',
                token: token
            });
        });
    } else {
        return res.status(400).json({ message: 'Dados inválidos.' });
    }
});

router.get('/me', (req, res) => {
    var token = req.header('X-Access-Token');
    if (!token) return res.status(401).json({ message: 'Pedido necessita do token de identificação.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Ocorreu um erro a identificar o utilizador.' });
        db.query('SELECT user_id, user_email, user_fullname FROM user WHERE user_id = ?;', [decoded.id], (err, result) => {
            if (!result[0]) {
                return res.status(404).json({ message: 'Token inválido.' });
            }
            return res.status(200).json({ user: result[0] });
        });
    })
})

router.post('/register', (req, res) => {
    if (
        !req.body.user_fullname ||
        !req.body.user_email ||
        !req.body.user_password
    ) {
        return res.status(400).json({ message: 'Dados em falta.' });
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.user_password, salt);

    db.query("INSERT INTO user (user_fullname, user_email, user_password) VALUES (?, ?, ?)", [
        req.body.user_fullname,
        req.body.user_email,
        hash,
    ], (err, result) => {
        if (err) {
            if (err.errno == "1062") {
                return res.status(500).json({ message: "Email já registado." });
            }
            return res.status(500).send({ message: 'Ocorreu um erro no registo.' });
        }
        return res.status(200).send({ response: 'Utilizador registado com sucesso.' });
    });
});

module.exports = router;