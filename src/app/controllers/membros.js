//const Intl = require('intl')

const Membro = require('../models/membro')
const { age, date } = require('../../lib/utils')
var CryptoJS = require("crypto-js")
module.exports = {
    index(req, res){
        const { filter } = req.query
        if(filter){
            Membro.findBy(filter, function(membros){
                return res.render(`membros/index`, {membros, filter})  
            })
        }else{
            Membro.all(function(membros){
                return res.render(`membros/index`, {membros})  
            })
        }
        
        
    },
    create(req, res){
        return res.render("membros/create")
        
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
        Membro.create(req.body, function(membro){
            return res.redirect(`/membros/${membro.id}`)
        })
        
    },
    show(req, res){
        Membro.find(req.params.id, function(membro){
            if (!membro) return res.send('Membro not found')

            membro.age = age(membro.datanasc)
            membro.datainicio = date(membro.datainicio).format
            
            return res.render('membros/show', {membro})
        })
    },
    edit(req, res){
        
        Membro.find(req.params.id, function(membro){
            if (!membro) return res.send('Membro not found')
            var bytes  = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
            membro.senha = bytes.toString(CryptoJS.enc.Utf8)
            membro.birth = date(membro.datanasc).iso
              //Membro.instructorSelectOptions(function(options){
                return res.render("membros/edit", {membro})
           // })
            
        })
    },
    put(req, res){

        const keys = Object.keys(req.body)
        var error = ""
        for(key of keys){
            if(req.body[key] == ""){
                error = "Todos os campos devem ser preenchidos!"
                console.log(`teste ${req.body.id}`)
            }      
        }
        

        if(error == ""){
            //Organizando os dados
            Membro.update(req.body, function(){
                return res.redirect(`/membros/${req.body.id}`)
            })
        }else{

             Membro.find(req.body.id, function(membro){
                if(!membro){
                    res.send('Member not found')
                }
                var bytes  = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
                membro.senha = bytes.toString(CryptoJS.enc.Utf8)
               //membro.birth = date(membro.datanasc).iso
                return res.render("membros/edit", {membro, error})
                exit
            })

        }
    },
    delete(req, res){
        console.log("oioioi")
        var error = ''
        Membro.checkBond(req.body.id, function(isAchou){
            if(isAchou){
                error = "Membro com financeiro vinculado."
                Membro.find(req.body.id, function(membro){
                    var bytes  = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
                    membro.senha = bytes.toString(CryptoJS.enc.Utf8)
                    membro.birth = date(membro.datanasc).iso
                    return res.render("membros/edit", {membro, error})
                })
            }else{
                Membro.delete(req.body.id, function(){
                return res.redirect(`/membros`)
            })
            }
        })
        
    },
}