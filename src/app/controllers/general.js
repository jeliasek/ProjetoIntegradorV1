//const Intl = require('intl')

const Instructor = require('../models/instructor')
const { age, date } = require('../../lib/utils')

module.exports = {
   
    home(req, res){
        return res.render("general/home")
    },
    panelDirector(req, res){
        return res.render("general/panelDirector")
    }
}