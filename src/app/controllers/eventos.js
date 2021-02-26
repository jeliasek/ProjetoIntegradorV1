//const Intl = require('intl')

const Evento = require('../models/evento')
const { age, date, tokenId } = require('../../lib/utils')
const e = require('express')

module.exports = {
    index(req, res){
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            const { filter } = req.query
            if(filter){
                Evento.findBy(filter, function(eventos){
                    return res.render(`eventos/index`, {eventos, filter, token})  
                })
            }else{
                Evento.all(function(eventos){
                    return res.render(`eventos/index`, {eventos, token})
                })
            }
        }
        
        
    },
    create(req, res){
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            return res.render("eventos/create", {token})
        }
        
    },
    post(req, res){
        //Usar req.body
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            const keys = Object.keys(req.body)

            for(key of keys){
                if(req.body[key] == ""){
                    return res.send("Please, fill all fields!")
                }
            }

            //Organizando os dados
            Evento.create(req.body, function(evento){
                return res.redirect(`/eventos/${evento.id}/${token}`)
            })
        }
    },
    show(req, res){
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            Evento.find(req.params.id, function(evento){
                if (!evento) return res.send('Evento not found')

                evento.datainicio = date(evento.datainicio).format
                evento.datafim = date(evento.datafim).format
                return res.render('eventos/show', {evento, token})
            })
        }
    },
    edit(req, res){
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            Evento.find(req.params.id, function(evento){
                if (!evento) return res.send('Evento not found')

            evento.datainicio = date(evento.datainicio).iso
            evento.datafim = date(evento.datafim).iso
                //User.instructorSelectOptions(function(options){
                    return res.render("eventos/edit", {evento, token})
            // })
                
            })
        }
    },
    put(req, res){
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            const keys = Object.keys(req.body)
            var error = ""
            for(key of keys){
                if(req.body[key] == ""){
                    error = "Todos os campos devem ser preenchidos!"
                }      
            }
            
            if(error == ""){
                //Organizando os dados
                Evento.update(req.body, function(){
                    return res.redirect(`/eventos/${req.body.id}/${token}`)
                })
            }else{
                Evento.find(req.body.id, function(evento){
                    return res.render("eventos/edit", {evento, error, token})
                })
            }
        }
    },
    delete(req, res){
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            Evento.delete(req.body.id, function(){
                return res.redirect(`/eventos/${token}`)
            })
        }
    },
}