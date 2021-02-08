//const Intl = require('intl')

const Financeiro = require('../models/financeiro')
const { age, date } = require('../../lib/utils')

module.exports = {
    index(req, res){
        const { filter } = req.query
        if(filter){
            Financeiro.findBy(filter, function(financeiros){
                return res.render(`financeiros/index`, {financeiros, filter})  
            })
        }else{
            Financeiro.all(function(financeiros){
                return res.render(`financeiros/index`, {financeiros})  
            })
        }
        
        
    },
    create(req, res){
        Financeiro.usersSelectOptions(function(options){
            return res.render("financeiros/create", {userOptions: options})
        })
        
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

        Financeiro.create(req.body, function(financeiro){
            return res.redirect(`/financeiros/${financeiro.id}`)
        })
        
    },
    show(req, res){
        Financeiro.find(req.params.id, function(financeiro){
            if (!financeiro) return res.send('Financeiro not found')

            return res.render('financeiros/show', {financeiro})
        })
    },
    edit(req, res){
        Financeiro.find(req.params.id, function(financeiro){
            if (!financeiro) return res.send('Financeiro not found')

           // member.birth = date(financeiro.birth).iso
            
            Financeiro.usersSelectOptions(function(options){
                return res.render("financeiros/edit", {financeiro, userOptions: options})
            })
            
        })
    },
    put(req, res){

        const keys = Object.keys(req.body)

        for(key of keys){
            if(req.body[key] == ""){
                return res.send("Please, fill all fields!")
            }
        }

        //Organizando os dados
        Financeiro.update(req.body, function(){
            return res.redirect(`/financeiros/${req.body.id}`)
        })
    },
    delete(req, res){
        Financeiro.delete(req.body.id, function(){
            return res.redirect(`/financeiros`)
        })
    },
}