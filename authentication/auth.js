const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();

const db = require("../db.js");

router.use((req, res, next) => {
    var token = req.header('X-Access-Token');
    if (!token) return res.status(401).json({ message: 'Pedido necessita do token de identificação.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Token inválido.' });
        db.query('SELECT user_id, user_email, user_fullname FROM user WHERE user_id = ?;', [decoded.id], (err, result) => {
            if (!result[0]) {
                return res.status(404).json({ message: 'Token inválido.' });
            }
            req.user = result[0];
            next();
        });
    })
})

module.exports = router;