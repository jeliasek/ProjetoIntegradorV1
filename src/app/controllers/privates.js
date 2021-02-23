//const Intl = require('intl')

const Evento = require('../models/evento')
const Encontro = require('../models/encontro')
const Financeiro = require('../models/financeiro')
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

    indexEncontro(req, res){
        const token = req.params.token
        const { filter } = req.query
        if(filter){
            Encontro.findBy(filter, function(encontros){
                return res.render(`privates/encontros/index`, {encontros, filter, token})  
            })
        }else{
            Encontro.all(function(encontros){
                return res.render(`privates/encontros/index`, {encontros, token})  
            })
        }
    },

    showEncontro(req, res){
        const token = req.params.token
        Encontro.find(req.params.id, function(encontro){
            if (!encontro) return res.send('Encontro not found')

           // encontro.datainicio = date(encontro.datainicio).format
            //encontro.datafim = date(encontro.datafim).format
            return res.render('privates/encontros/show', {encontro, token})
        })
    },
    indexFinanceiro(req, res){
        const token = req.params.token
        const { filter } = req.query
        if(filter){
            Financeiro.findBy(filter, function(financeiros){
                return res.render(`privates/financeiros/index`, {financeiros, filter, token})  
            })
        }else{
            Financeiro.all(function(financeiros){
                return res.render(`privates/financeiros/index`, {financeiros, token})  
            })
        }
    },

    showFinanceiro(req, res){
        const token = req.params.token
        Financeiro.find(req.params.id, function(financeiro){
            if (!financeiro) return res.send('Financeiro not found')

           // encontro.datainicio = date(encontro.datainicio).format
            //encontro.datafim = date(encontro.datafim).format
            return res.render('privates/financeiros/show', {financeiro, token})
        })
    },
    
}