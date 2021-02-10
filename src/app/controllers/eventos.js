//const Intl = require('intl')

const Evento = require('../models/evento')
const { age, date } = require('../../lib/utils')
const e = require('express')

module.exports = {
    index(req, res){
        const { filter } = req.query
        if(filter){
            Evento.findBy(filter, function(eventos){
                return res.render(`eventos/index`, {eventos, filter})  
            })
        }else{
            Evento.all(function(eventos){
                return res.render(`eventos/index`, {eventos})  
            })
        }
        
        
    },
    create(req, res){
        return res.render("eventos/create")
        
    },
    post(req, res){
        //Usar req.body

        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == ""){
                return res.send("Please, fill all fields!")
            }
        }

        //Organizando os dados
        Evento.create(req.body, function(evento){
            return res.redirect(`/eventos/${evento.id}`)
        })
        
    },
    show(req, res){
        Evento.find(req.params.id, function(evento){
            if (!evento) return res.send('Evento not found')

            evento.datainicio = date(evento.datainicio).format
            evento.datafim = date(evento.datafim).format
            return res.render('eventos/show', {evento})
        })
    },
    edit(req, res){
        Evento.find(req.params.id, function(evento){
            if (!evento) return res.send('Evento not found')

           evento.datainicio = date(evento.datainicio).iso
           evento.datafim = date(evento.datafim).iso
              //User.instructorSelectOptions(function(options){
                return res.render("eventos/edit", {evento})
           // })
            
        })
    },
    put(req, res){

        const keys = Object.keys(req.body)
        var error = ""
        for(key of keys){
            if(req.body[key] == ""){
                error = "Todos os campos devem ser preenchidos!"
                Evento.find(req.body.id, function(evento){
                    return res.render("eventos/edit", {evento, error})
                })
            }      
        }
        
        if(error == ""){
            //Organizando os dados
            Evento.update(req.body, function(){
                return res.redirect(`/eventos/${req.body.id}`)
            })
        }
    },
    delete(req, res){
        Evento.delete(req.body.id, function(){
            return res.redirect(`/eventos`)
        })
    },
}