const db = require('../../config/db')

module.exports = {
    participarEncontro(idEncontro, idMembro, callback){
        
        const query = `
            INSERT INTO membrosencontro(
                idencontro,
                idmembro
            ) VALUES ($1, $2)
        `
       
        const values = [
            idEncontro,
            idMembro
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database Error!  --- ${err}`

            callback(results.rows[0])
        })

    },

    RetornaparticipantesEncontro(idEncontro, callback){
        db.query(`SELECT m.foto as foto, m.nome as nome, m.id as id, m.email as email, m.situacao as situacao, e.descricao as descricao FROM membros m
                  JOIN membrosencontro f
                    ON m.id = f.idmembro
                  JOIN encontros e
                    ON e.id = f.idencontro
                  WHERE e.id = $1`, [idEncontro], function(err, results){
                    if(err) throw `Database Error! ${err}`
                    callback(results.rows)
                })
    },

    RetornaDescricaoEncontro(idEncontro,callback){
        db.query(`SELECT descricao FROM encontros WHERE id = $1`, [idEncontro], function(err, results){
            if(err) throw `Database Error! ${err}`
            callback(results.rows[0])
        })
    },

    participarEvento(idEvento, idMembro, callback){
        
        const query = `
            INSERT INTO membrosevento(
                idevento,
                idmembro
            ) VALUES ($1, $2)
        `
       
        const values = [
            idEvento,
            idMembro
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database Error!  --- ${err}`

            callback(results.rows[0])
        })

    },

    retirarEvento(idEvento, idMembro, callback){
        db.query(`DELETE FROM membrosEvento WHERE idevento = ${idEvento} AND idmembro = ${idMembro}`, function(err, results){
            if(err) throw `Database Error! ${err} `

            return callback()
        })
    },

    retirarEncontro(idEncontro, idMembro, callback){
        db.query(`DELETE FROM membrosencontro WHERE idencontro = ${idEncontro} AND idmembro = ${idMembro}`, function(err, results){
            if(err) throw `Database Error! ${err} `

            return callback()
        })
    },

    RetornaparticipantesEvento(idEvento, callback){
        db.query(`SELECT m.foto AS foto, m.nome AS nome, m.id AS id, m.email AS email, m.situacao AS situacao, e.descricao AS descricao FROM membros m
                  JOIN membrosevento f
                    ON m.id = f.idmembro
                  JOIN eventos e
                    ON e.id = f.idevento
                  WHERE e.id = $1`, [idEvento], function(err, results){
                    if(err) throw `Database Error! ${err}`
                    callback(results.rows)
                })
    },

    RetornaDescricaoEvento(idEvento,callback){
        db.query(`SELECT descricao FROM eventos WHERE id = $1`, [idEvento], function(err, results){
            if(err) throw `Database Error! ${err}`
            callback(results.rows[0])
        })
    }
        
    
}