const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

const db = require("./db.js");
const url = 'https://www.maisgasolina.com/';

module.exports = () => {
    axios(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const dados = $('#homeAverage');
        const precos = [
            {
                tipo: "gasolina95simples",
                preco: dados[0].children[2].children[1].data
            },
            {
                tipo: "gasolina95plus",
                preco: dados[0].children[4].children[1].data
            },
            {
                tipo: "gasolina98simples",
                preco: dados[0].children[6].children[1].data
            },
            {
                tipo: "gasolina98plus",
                preco: dados[0].children[8].children[1].data
            },
            {
                tipo: "gasoleoSimples",
                preco: dados[0].children[10].children[1].data
            },
            {
                tipo: "gasoleoPlus",
                preco: dados[0].children[12].children[1].data
            },
            {
                tipo: "gplAuto",
                preco: dados[0].children[14].children[1].data
            }
        ];
        const baratos = $("#homeCheap");
        const precosBaratos = [
            {
                tipo: "gasolina95simples",
                preco: baratos[0].children[2].children[1].data
            },
            {
                tipo: "gasolina95plus",
                preco: baratos[0].children[4].children[1].data
            },
            {
                tipo: "gasolina98simples",
                preco: baratos[0].children[6].children[1].data
            },
            {
                tipo: "gasolina98plus",
                preco: baratos[0].children[8].children[1].data
            },
            {
                tipo: "gasoleoSimples",
                preco: baratos[0].children[10].children[1].data
            },
            {
                tipo: "gasoleoPlus",
                preco: baratos[0].children[12].children[1].data
            },
            {
                tipo: "gplAuto",
                preco: baratos[0].children[14].children[1].data
            }
        ];
        let i = 0;
        function inserirPreco() {
            if (i < precos.length) {
                db.query("INSERT INTO combustivel (combustivel_tipo, combustivel_preco_medio, combustivel_preco_barato, combustivel_data) VALUES (?, ?, ?, ?)", [precos[i].tipo, precos[i].preco.substring(1, precos[i].preco.length), precosBaratos[i].preco.substring(1, precosBaratos[i].preco.length), moment().format("YYYY-MM-DD")], function (err, result) {
                    if (err) throw err;
                    console.log(i);
                    i++;
                    inserirPreco();
                });
            }
        }
        inserirPreco();
    })
    .catch(console.error);
}