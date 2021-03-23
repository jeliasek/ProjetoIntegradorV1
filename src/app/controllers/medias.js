//const Intl = require('intl')

const Media = require('../models/media')
const { age, date, tokenId } = require('../../lib/utils')
const e = require('express')

module.exports = {
    index(req, res) {
        const token = req.params.token
        const { filter } = req.query
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            if (filter) {
                Media.findBy(filter, function (medias) {
                    for (var media in medias) {
                        medias[media].data = date(medias[media].data).format
                    }
                    return res.render(`medias/index`, { medias, filter, token })
                })
            } else {
                Media.all(function (medias) {
                    for (var media in medias) {
                        medias[media].data = date(medias[media].data).format
                    }
                    return res.render(`medias/index`, { medias, token })
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
            return res.render("medias/create", { token })
        }

    },
    post(req, res) {
        //Usar req.body
        const token = req.params.token
        const keys = Object.keys(req.body)
        var idMembro = 0
        idMembro = tokenId(token)
        if (idMembro == 0) {
            res.redirect("/general/error")
        } else {
            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send("Please, fill all fields!")
                }
            }

            //Organizando os dados
            Media.create(req.body, function (media) {
                return res.redirect(`/medias/${media.id}/${token}`)
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
            Media.find(req.params.id, function (media) {
                if (!media) return res.send('Event not found')

                media.data = date(media.data).format
                return res.render('medias/show', { media, token })
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
            Media.find(req.params.id, function (media) {
                if (!media) return res.send('media not found')

                media.data = date(media.data).iso
                //User.instructorSelectOptions(function(options){
                return res.render("medias/edit", { media, token })
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
            error = ""
            const keys = Object.keys(req.body)
            for (key of keys) {
                if (req.body[key] == "") {
                    error = "Todos os campos devem ser preenchidos!"
                }
            }

            //Organizando os dados
            if (error == "") {
                Media.update(req.body, function () {
                    return res.redirect(`/medias/${req.body.id}/${token}`)
                })
            } else {
                Media.find(req.body.id, function (media) {
                    media.data = date(media.data).iso
                    return res.render("medias/edit", { media, error, token })
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
            Media.delete(req.body.id, function () {
                return res.redirect(`/medias/${token}`)
            })
        }
    },
}