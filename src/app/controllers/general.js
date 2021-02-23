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
        var idMembro = 5
        idMembro = tokenId(token)
        console.log(`ID do Membro: ${idMembro}`)
        Membro.find(idMembro, function(membro){
            if (!membro) return res.send('Member not found')

            membro.age = age(membro.datanasc)
            membro.datainicio = date(membro.datainicio).format
            
            return res.render("general/home", {membro, token})
        })
    
    },
    panelDirector(req, res){
        console.log(req.body)
        return res.render("general/panelDirector")
    },
    login(req, res){
        return res.render("general/login")
    },
     async authenticate(req, res){
        const{ usuario, senha } = req.body;
        //const usuario = "joaoeliax"
        //const senha = "123"
         await Membro.checkUser(usuario, function(membro){
            if(!membro){
                return res.status(400).send({ error: 'User not found'})
            }else{
                var bytes  = CryptoJS.AES.decrypt(membro.senha, 'secret key 123');
                membro.senha = bytes.toString(CryptoJS.enc.Utf8)
                console.log(`Senha Banco: ${membro.senha}, Senha Enviada: ${senha}`)
                if(senha != membro.senha){
                    return res.status(400).send({ error: 'Invalid Password'})
                }else{
                    membro.senha = undefined

                    const token = jwt.sign({ id:membro.id }, authConfig.secret, {
                        expiresIn: 86400,
                    })
                    console.log(token)
                    //req.headers.authorization = token
                    //console.log(req.headers.authorization)
                    //res.setHeader('Authentication', token);
                    return res.redirect(`general/home/${token}`)
                    
                    
                }
                
            }
        })
    }
}