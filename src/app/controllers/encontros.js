//const Intl = require('intl')

const Encontro = require('../models/encontro')
const { age, date } = require('../../lib/utils')
const e = require('express')

module.exports = {
    index(req, res){
        const { filter } = req.query
        if(filter){
            Encontro.findBy(filter, function(encontros){
                return res.render(`encontros/index`, {encontros, filter})  
            })
        }else{
            Encontro.all(function(encontros){
                return res.render(`encontros/index`, {encontros})  
            })
        }
        
        
    },
    create(req, res){
        return res.render("encontros/create")
        
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
        Encontro.create(req.body, function(encontro){
            return res.redirect(`/encontros/${encontro.id}`)
        })
        
    },
    show(req, res){
        Encontro.find(req.params.id, function(encontro){
            if (!encontro) return res.send('Event not found')

            encontro.data = date(encontro.data).format
            return res.render('encontros/show', {encontro})
        })
    },
    edit(req, res){
        Encontro.find(req.params.id, function(encontro){
            if (!encontro) return res.send('Encontro not found')

           encontro.data = date(encontro.data).iso
              //User.instructorSelectOptions(function(options){
                return res.render("encontros/edit", {encontro})
           // })
            
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
        Encontro.update(req.body, function(){
            return res.redirect(`/encontros/${req.body.id}`)
        })
    },
    delete(req, res){
        Encontro.delete(req.body.id, function(){
            return res.redirect(`/encontros`)
        })
    },
}