//const Intl = require('intl')

const Evento = require('../models/evento')
const { age, date } = require('../../lib/utils')
const e = require('express')

module.exports = {
    indexEvento(req, res){
        const token = req.params.token
        const { filter } = req.query
        if(filter){
            Evento.findBy(filter, function(eventos){
                return res.render(`privates/eventos/index`, {eventos, filter, token})  
            })
        }else{
            Evento.all(function(eventos){
                return res.render(`privates/eventos/index`, {eventos, token})  
            })
        }
    },
    
    showEvento(req, res){
        const token = req.params.token
        Evento.find(req.params.id, function(evento){
            if (!evento) return res.send('Evento not found')

            evento.datainicio = date(evento.datainicio).format
            evento.datafim = date(evento.datafim).format
            return res.render('privates/eventos/show', {evento, token})
        })
    },
    
}