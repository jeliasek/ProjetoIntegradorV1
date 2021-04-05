//const Intl = require('intl')

const Membro = require('../models/membro')
const { age, date, tokenId } = require('../../lib/utils')
var CryptoJS = require("crypto-js")
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
                Membro.findBy(filter, function (membros) {
                    return res.render(`membros/index`, { membros, filter, token })
                })
            } else {

                Membro.all(function (membros) {
                    return res.render(`membros/index`, { membros, token })
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
            return res.render("membros/create", { token })
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
            Membro.create(req.body, function (membro) {
                return res.redirect(`/membros/${membro.id}/${token}`)
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
            var id = 0
            if (req.params.id > 0) {
                id = req.params.id
            }
            Membro.find(id, function (membro) {
                if (!membro) return res.send('Membro not found')

                membro.age = age(membro.datanasc)
                membro.datainicio = date(membro.datainicio).format

                return res.render('membros/show', { membro, token })
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
            Membro.find(req.params.id, function (membro) {
                if (!membro) return res.send('Membro not found')
                var bytes = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
                membro.senha = bytes.toString(CryptoJS.enc.Utf8)
                membro.birth = date(membro.datanasc).iso
                //Membro.instructorSelectOptions(function(options){
                return res.render("membros/edit", { membro, token })
                // })

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
            var error = ""
            for (key of keys) {
                if (key == "senha") {
                    if (req.body[key].length < 6) {
                        error = "A senha deve ter no mínimo 6 caracteres"
                    }
                }
                if (req.body[key] == "") {
                    error = "Todos os campos devem ser preenchidos!"
                }
            }


            if (error == "") {
                //Organizando os dados
                Membro.update(req.body, function () {
                    return res.redirect(`/membros/${req.body.id}/${token}`)
                })
            } else {

                Membro.find(req.body.id, function (membro) {
                    if (!membro) {
                        res.send('Member not found')
                    }
                    var bytes = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
                    membro.senha = bytes.toString(CryptoJS.enc.Utf8)
                    membro.birth = date(membro.datanasc).iso
                    return res.render("membros/edit", { membro, error, token })
                })

            }
        }
    },
    delete(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            var error = ''
            Membro.checkBond(req.body.id, function (isAchou) {
                if (isAchou) {
                    error = "Membro com financeiro vinculado."
                    Membro.find(req.body.id, function (membro) {
                        var bytes = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
                        membro.senha = bytes.toString(CryptoJS.enc.Utf8)
                        membro.birth = date(membro.datanasc).iso
                        return res.render("membros/edit", { membro, error, token })
                    })
                } else {
                    Membro.delete(req.body.id, function () {
                        return res.redirect(`/membros/${token}`)
                    })
                }
            })
        }

    },
    desbloquear(req, res) {
        const token = req.params.token
        const id = req.params.id
        Membro.zeraTentativasId(id, function () {
            res.redirect(`/membros/${id}/${token}`)
        })
    }
}