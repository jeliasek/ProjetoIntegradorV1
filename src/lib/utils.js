const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
module.exports = {
    age(timestamp){
            
            const today = new Date()
            const birthDate = new Date(timestamp)
        
            let age = today.getUTCFullYear() - birthDate.getUTCFullYear()
            const month = today.getUTCMonth() - birthDate.getUTCMonth()
            if(month < 0 || month == 0 && today.getUTCDate() < birthDate.getUTCDate()){
                age -= 1
            }
    
            return age
    
    },

    date(timestamp){
        const date = new Date(timestamp)
        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)
        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`, // iso
            format: `${day}/${month}/${year}`
        }
    },

    tokenId(token){
        const parts = token.split(' ')

        if(!parts.length === 2)
            return res.status(401).send({ error: 'Token error' })
        
        const [ scheme, auxToken] = parts
        if(!/^Bearer$/i.test(scheme))
            return res.status(401).send({ error: 'Token malformatted' })
        
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if(err) return res.status(401).send({ error: 'Token invalid' })

                return decoded.id
        })
    }
}