//const Intl = require('intl')

const Financeiro = require('../models/financeiro')
const { age, date, tokenId } = require('../../lib/utils')

module.exports = {
    index(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            const { filter } = req.query
            if (filter) {
                Financeiro.findBy(filter, function (financeiros) {
                    let totalGeral = 0;
                    let totalEntrada = 0;
                    let totalSaida = 0;
                    for (let financeiro in financeiros) {

                        if (financeiros[financeiro].tipo === 'E') {
                            totalEntrada += Number(financeiros[financeiro].valor)
                        } else {
                            totalSaida += Number(financeiros[financeiro].valor)
                        }
                    }
                    totalGeral = totalEntrada - totalSaida
                    const saldo = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalGeral)
                    const totalEntradas = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalEntrada)
                    const totalSaidas = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalSaida)
                    return res.render(`financeiros/index`, { financeiros, filter, token, saldo, totalEntradas, totalSaidas })
                })
            } else {
                Financeiro.all(function (financeiros) {
                    let totalGeral = 0;
                    let totalEntrada = 0;
                    let totalSaida = 0;
                    for (let financeiro in financeiros) {
                        if (financeiros[financeiro].tipo === 'E') {
                            totalEntrada += Number(financeiros[financeiro].valor)
                        } else {
                            totalSaida += Number(financeiros[financeiro].valor)
                        }
                    }
                    totalGeral = totalEntrada - totalSaida
                    const saldo = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalGeral)
                    const totalEntradas = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalEntrada)
                    const totalSaidas = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(totalSaida)
                    return res.render(`financeiros/index`, { financeiros, token, saldo, totalEntradas, totalSaidas })
                })
            }
        }

    },
    create(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Financeiro.usersSelectOptions(function (options) {
                return res.render("financeiros/create", { userOptions: options, token })
            })
        }

    },
    post(req, res) {
        //Usar req.body
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Please, fill all fields!")
                }
            }

            //Organizando os dados

            Financeiro.create(req.body, function (financeiro) {
                return res.redirect(`/financeiros/${financeiro.id}/${token}`)
            })
        }
    },
    show(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Financeiro.find(req.params.id, function (financeiro) {
                if (!financeiro) return res.send('Financeiro not found')

                return res.render('financeiros/show', { financeiro, token })
            })
        }
    },
    edit(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Financeiro.find(req.params.id, function (financeiro) {
                if (!financeiro) return res.send('Financeiro not found')

                // member.birth = date(financeiro.birth).iso

                Financeiro.usersSelectOptions(function (options) {
                    return res.render("financeiros/edit", { financeiro, userOptions: options, token })
                })

            })
        }
    },
    put(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Please, fill all fields!")
                }
            }

            //Organizando os dados
            Financeiro.update(req.body, function () {
                return res.redirect(`/financeiros/${req.body.id}/${token}`)
            })
        }
    },
    delete(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Financeiro.delete(req.body.id, function () {
                return res.redirect(`/financeiros/${token}`)
            })
        }
    },
}