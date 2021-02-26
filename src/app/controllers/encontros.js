//const Intl = require('intl')

const Encontro = require('../models/encontro')
const { age, date, tokenId } = require('../../lib/utils')
const e = require('express')

module.exports = {
    index(req, res){
        const token = req.params.token
        const { filter } = req.query
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            if(filter){
                Encontro.findBy(filter, function(encontros){
                    return res.render(`encontros/index`, {encontros, filter, token})  
                })
            }else{
                Encontro.all(function(encontros){
                    return res.render(`encontros/index`, {encontros, token})  
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
            return res.render("encontros/create", {token})
        }
        
    },
    post(req, res){
        //Usar req.body
        const token = req.params.token
        const keys = Object.keys(req.body)
        var idMembro = 0
        idMembro = tokenId(token)
        if(idMembro == 0){
            res.redirect("/general/error")
        }else{
            for(key of keys){
                if(req.body[key] == ""){
                    return res.send("Please, fill all fields!")
                }
            }

            //Organizando os dados
            Encontro.create(req.body, function(encontro){
                return res.redirect(`/encontros/${encontro.id}/${token}`)
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
            Encontro.find(req.params.id, function(encontro){
                if (!encontro) return res.send('Event not found')

                encontro.data = date(encontro.data).format
                return res.render('encontros/show', {encontro, token})
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
            Encontro.find(req.params.id, function(encontro){
                if (!encontro) return res.send('Encontro not found')

            encontro.data = date(encontro.data).iso
                //User.instructorSelectOptions(function(options){
                    return res.render("encontros/edit", {encontro, token})
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
            error = ""
            const keys = Object.keys(req.body)
            for(key of keys){
                if(req.body[key] == ""){
                    error = "Todos os campos devem ser preenchidos!"
                }     
            }

            //Organizando os dados
            if(error == ""){
                Encontro.update(req.body, function(){
                    return res.redirect(`/encontros/${req.body.id}/${token}`)
                })
            }else{
                Encontro.find(req.body.id, function(encontro){
                    encontro.data = date(encontro.data).iso
                    return res.render("encontros/edit", {encontro, error, token})
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
            Encontro.delete(req.body.id, function(){
                return res.redirect(`/encontros/${token}`)
            })
        }
    },
}