const express = require('express')
const routes = express.Router()
const authMiddleware = require('./middlewares/auth')
const general = require('./app/controllers/general')
const membros = require('./app/controllers/membros')
const eventos = require('./app/controllers/eventos')
const encontros = require('./app/controllers/encontros')
const financeiros = require("./app/controllers/financeiros")




routes.get('/general/login', general.login)

routes.post("/general/", general.authenticate)
routes.get("/general/panelDirector", general.panelDirector)
//routes.use(authMiddleware)

routes.post('/', function(req, res){
    return res.redirect("/general/home")
    //res.send({ ok: true })
})
routes.get('/general/home', general.home)


routes.get('/membros', membros.index)
routes.get('/membros/create', membros.create)
routes.post("/membros", membros.post)
routes.get('/membros/:id', membros.show)
routes.get('/membros/:id/edit', membros.edit)
routes.put("/membros", membros.put)
routes.delete("/membros", membros.delete)

routes.get('/eventos', eventos.index)
routes.get('/eventos/create', eventos.create)
routes.post("/eventos", eventos.post)
routes.get('/eventos/:id', eventos.show)
routes.get('/eventos/:id/edit', eventos.edit)
routes.put("/eventos", eventos.put)
routes.delete("/eventos", eventos.delete)

routes.get('/encontros', encontros.index)
routes.get('/encontros/create', encontros.create)
routes.post("/encontros", encontros.post)
routes.get('/encontros/:id', encontros.show)
routes.get('/encontros/:id/edit', encontros.edit)
routes.put("/encontros", encontros.put)
routes.delete("/encontros", encontros.delete)

routes.get('/financeiros', financeiros.index)
routes.get('/financeiros/create', financeiros.create)
routes.post("/financeiros", financeiros.post)
routes.get('/financeiros/:id', financeiros.show)
routes.get('/financeiros/:id/edit', financeiros.edit)
routes.put("/financeiros", financeiros.put)
routes.delete("/financeiros", financeiros.delete)

module.exports = routes
