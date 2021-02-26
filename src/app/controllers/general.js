//const Intl = require('intl')

const Membro = require('../models/membro')
const { age, date, tokenId } = require('../../lib/utils')
var CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const authConfig = require("../../config/auth")
const express = require('express')
const routes = express.Router()

module.exports = {
   
    home(req, res){
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        Membro.find(idMembro, function(membro){
            if (!membro) return res.send('Member not found')

            membro.age = age(membro.datanasc)
            membro.datainicio = date(membro.datainicio).format
            
            return res.render("general/home", {membro, token})
        })
    
    },
    panelDirector(req, res){
        const token = req.params.token
        var idMembro = 0
        idMembro = tokenId(token)
        Membro.find(idMembro, function(membro){
            if (!membro) return res.send('Member not found')

            membro.age = age(membro.datanasc)
            membro.datainicio = date(membro.datainicio).format
            
            return res.render("general/panelDirector", {membro, token})
        })
        
    },
    login(req, res){
        return res.render("general/login")
    },
     async authenticate(req, res){
        const{ usuario, senha } = req.body;
        var error
        //const usuario = "joaoeliax"
        //const senha = "123"
         await Membro.checkUser(usuario, function(membro){
            if(!membro){
                error = "Usuário não encontrado!"
                res.render("general/login", {error})
                //return res.status(400).send({ error: 'User not found'})
            }else{
                var bytes  = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
                membro.senha = bytes.toString(CryptoJS.enc.Utf8)
                if(senha != membro.senha){
                    error = "Senha Inválida!"
                    Membro.incrementaTentativa(usuario, function(){
                    
                    })
                    return res.render('general/login', {error})
                    //return res.status(400).send({ error: 'Invalid Password'})
                }else{
                    if(membro.tentativas > 4){
                        error = "Usuário Bloqueado, pois excedeu o número de tentativas. Entre em contato com a diretoria para desbloquear."
                        return res.render('general/login', {error})
                    }
                    membro.senha = undefined

                    const token = jwt.sign({ id:membro.id }, authConfig.secret, {
                        expiresIn: 86400,
                    })
                    //req.headers.authorization = token
                    //console.log(req.headers.authorization)
                    //res.setHeader('Authentication', token);
                    Membro.zeraTentativas(usuario, function(){

                    })
                    return res.redirect(`general/home/${token}`)
                    
                    
                }
                
            }
        })
    }
}