//const Intl = require('intl')

const Evento = require('../models/evento')
const Encontro = require('../models/encontro')
const Financeiro = require('../models/financeiro')
const Membro = require('../models/membro')
const Private = require('../models/private')
const { age, date, tokenId } = require('../../lib/utils')
const e = require('express')
var CryptoJS = require("crypto-js")

module.exports = {
    async indexEvento(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            const { filter } = req.query
            if (filter) {
                Evento.findByOfMember(idMembro, filter, function (eventos) {
                    for (var evento in eventos) {

                        const now = new Date;
                        let isPassou = false
                        if (eventos[evento].datafim < now) {
                            isPassou = true
                        }
                        eventos[evento] = {
                            ...eventos[evento],
                            isPassou,

                        }
                    }
                    return res.render(`privates/eventos/index`, { eventos, filter, token })
                })
            } else {
                Evento.allOfMember(idMembro, function (eventos) {
                    for (var evento in eventos) {

                        const now = new Date;
                        let isPassou = false
                        if (eventos[evento].datafim < now) {
                            isPassou = true
                        }
                        eventos[evento] = {
                            ...eventos[evento],
                            isPassou,

                        }
                    }
                    return res.render(`privates/eventos/index`, { eventos, token })
                })
            }
        }
    },

    showEvento(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Evento.find(req.params.id, function (evento) {
                if (!evento) return res.send('Evento not found')

                evento.datainicio = date(evento.datainicio).format
                evento.datafim = date(evento.datafim).format
                return res.render('privates/eventos/show', { evento, token })
            })
        }
    },

    indexEncontro(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            const { filter } = req.query
            if (filter) {
                Encontro.findByOfMember(idMembro, filter, function (encontros) {
                    for (var encontro in encontros) {

                        const now = new Date;
                        let isPassou = false
                        if (encontros[encontro].data < now) {
                            isPassou = true
                        }
                        encontros[encontro].data = date(encontros[encontro].data).format,
                            encontros[encontro] = {
                                ...encontros[encontro],
                                isPassou,

                            }
                    }
                    return res.render(`privates/encontros/index`, { encontros, filter, token })
                })
            } else {
                Encontro.allOfMember(idMembro, function (encontros) {
                    for (var encontro in encontros) {

                        const now = new Date;
                        let isPassou = false
                        if (encontros[encontro].data < now) {
                            isPassou = true
                        }
                        encontros[encontro].data = date(encontros[encontro].data).format,
                            encontros[encontro] = {
                                ...encontros[encontro],
                                isPassou,

                            }
                    }
                    return res.render(`privates/encontros/index`, { encontros, token })
                })
            }
        }
    },

    showEncontro(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Encontro.find(req.params.id, function (encontro) {
                if (!encontro) return res.send('Encontro not found')

                encontro.data = date(encontro.data).format
                return res.render('privates/encontros/show', { encontro, token })
            })
        }
    },
    indexFinanceiro(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            const { filter } = req.query
            if (filter) {
                Financeiro.findByOfMember(filter, idMembro, function (financeiros) {
                    return res.render(`privates/financeiros/index`, { financeiros, filter, token })
                })
            } else {
                Financeiro.allOfMember(idMembro, function (financeiros) {
                    return res.render(`privates/financeiros/index`, { financeiros, token })
                })
            }
        }
    },

    showFinanceiro(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Financeiro.find(req.params.id, function (financeiro) {
                if (!financeiro) return res.send('Financeiro not found')

                // encontro.datainicio = date(encontro.datainicio).format
                //encontro.datafim = date(encontro.datafim).format
                return res.render('privates/financeiros/show', { financeiro, token })
            })
        }
    },

    showMembro(req, res) {
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Membro.find(req.params.id, function (membro) {
                if (!membro) return res.send('Membro not found')

                membro.age = age(membro.datanasc)
                membro.datainicio = date(membro.datainicio).format
                return res.render('privates/membros/show', { membro, token })
            })
        }
    },

    editMembro(req, res) {
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
                return res.render("privates/membros/edit", { membro, token })
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
                if (req.body[key] == "") {
                    error = "Todos os campos devem ser preenchidos!"
                }
            }


            if (error == "") {
                //Organizando os dados
                Membro.updatePrivate(req.body, function () {
                    return res.redirect(`/privates/membros/${req.body.id}/${token}`)
                })
            } else {

                Membro.find(req.body.id, function (membro) {
                    if (!membro) {
                        res.send('Member not found')
                    }
                    var bytes = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
                    membro.senha = bytes.toString(CryptoJS.enc.Utf8)
                    //membro.birth = date(membro.datanasc).iso
                    return res.render("privates/membros/edit", { membro, error, token })
                })

            }
        }
    },


    participarEncontro(req, res) {
        const token = req.params.token
        const idEncontro = req.params.id
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Membro.find(idMembro, function (membro) {
                if (!membro) return res.send('Member not found')
            })

            Private.participarEncontro(idEncontro, idMembro, function (participante) {

                return res.redirect(`/privates/encontros/${token}`)
            })
        }
    },

    participantesEncontro(req, res) {

        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            const idEncontro = req.params.id
            var descricaoEncontro
            Private.RetornaDescricaoEncontro(idEncontro, function (descricao) {

                descricaoEncontro = descricao.descricao
            })
            Private.RetornaparticipantesEncontro(idEncontro, function (participantes) {
                return res.render(`privates/encontros/participantes`, { token, participantes, descricaoEncontro })
            })
        }
    },

    participarEvento(req, res) {
        const token = req.params.token
        const idEvento = req.params.id
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Membro.find(idMembro, function (membro) {
                if (!membro) return res.send('Member not found')
            })

            Private.participarEvento(idEvento, idMembro, function (participante) {

                return res.redirect(`/privates/eventos/${token}`)
            })
        }
    },
    retirarEvento(req, res) {
        const token = req.params.token
        const idEvento = req.params.id
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Private.retirarEvento(idEvento, idMembro, function () {
                return res.redirect(`/privates/eventos/${token}`)
            })
        }
    },

    participantesEvento(req, res) {

        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            const idEvento = req.params.id
            var descricaoEvento
            Private.RetornaDescricaoEvento(idEvento, function (descricao) {

                descricaoEvento = descricao.descricao
            })
            Private.RetornaparticipantesEvento(idEvento, function (participantes) {
                return res.render(`privates/eventos/participantes`, { token, participantes, descricaoEvento })
            })
        }
    },
    retirarEncontro(req, res) {
        const token = req.params.token
        const idEncontro = req.params.id
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            Private.retirarEncontro(idEncontro, idMembro, function () {
                return res.redirect(`/privates/encontros/${token}`)
            })
        }
    }

}