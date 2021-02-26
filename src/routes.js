const express = require('express')
const routes = express.Router()
const authMiddleware = require('./middlewares/auth')
const general = require('./app/controllers/general')
const membros = require('./app/controllers/membros')
const eventos = require('./app/controllers/eventos')
const encontros = require('./app/controllers/encontros')
const financeiros = require("./app/controllers/financeiros")
const privates = require("./app/controllers/privates")



routes.get('/general/login', general.login)

routes.post("/general", general.authenticate)
routes.get('/general', general.login)
routes.get("/general/panelDirector/:token", general.panelDirector)
//routes.use(authMiddleware)

routes.get('/', function(req, res){
    return res.redirect("/general/login")
    //res.send({ ok: true })
})
routes.get('/general/home/:token', general.home)


routes.get('/membros/:token', membros.index)
routes.get('/membros/create/:token', membros.create)
routes.post("/membros/:token", membros.post)
routes.get('/membros/:id/:token', membros.show)
routes.get('/membros/:id/edit/:token', membros.edit)
routes.put("/membros/:token", membros.put)
routes.delete("/membros/:token", membros.delete)
routes.get('/membros/desbloquear/:id/:token', membros.desbloquear)

routes.get('/eventos/:token', eventos.index)
routes.get('/eventos/create/:token', eventos.create)
routes.post("/eventos/:token", eventos.post)
routes.get('/eventos/:id/:token', eventos.show)
routes.get('/eventos/:id/edit/:token', eventos.edit)
routes.put("/eventos/:token", eventos.put)
routes.delete("/eventos/:token", eventos.delete)

routes.get('/encontros/:token', encontros.index)
routes.get('/encontros/create/:token', encontros.create)
routes.post("/encontros/:token", encontros.post)
routes.get('/encontros/:id/:token', encontros.show)
routes.get('/encontros/:id/edit/:token', encontros.edit)
routes.put("/encontros/:token", encontros.put)
routes.delete("/encontros/:token", encontros.delete)

routes.get('/financeiros/:token', financeiros.index)
routes.get('/financeiros/create/:token', financeiros.create)
routes.post("/financeiros/:token", financeiros.post)
routes.get('/financeiros/:id/:token', financeiros.show)
routes.get('/financeiros/:id/edit/:token', financeiros.edit)
routes.put("/financeiros/:token", financeiros.put)
routes.delete("/financeiros/:token", financeiros.delete)

routes.get('/privates/eventos/:token', privates.indexEvento)
routes.get('/privates/eventos/:id/:token', privates.showEvento)
routes.get('/privates/eventos/participar/:id/:token', privates.participarEvento)
routes.get('/privates/eventos/participantes/:id/:token', privates.participantesEvento)
routes.get('/privates/eventos/retirar/:id/:token', privates.retirarEvento)

routes.get('/privates/encontros/:token', privates.indexEncontro)
routes.get('/privates/encontros/:id/:token', privates.showEncontro)
routes.get('/privates/encontros/participar/:id/:token', privates.participarEncontro)
routes.get('/privates/encontros/participantes/:id/:token', privates.participantesEncontro)
routes.get('/privates/encontros/retirar/:id/:token', privates.retirarEncontro)

routes.get('/privates/financeiros/:token', privates.indexFinanceiro)
routes.get('/privates/financeiros/:id/:token', privates.showFinanceiro)

routes.get('/privates/membros/:id/:token', privates.showMembro)
routes.get('/privates/membros/:id/edit/:token', privates.editMembro)
routes.put("/privates/membros/:token", privates.put)

module.exports = routes
