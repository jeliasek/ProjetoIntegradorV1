const db = require('../../config/db')
const { age, date } = require('../../lib/utils')
var CryptoJS = require("crypto-js")

module.exports = {
    all(callback){

        db.query(`SELECT * FROM membros ORDER BY nome`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    findBy(filter, callback){
        
        db.query(`SELECT membros.*
                  FROM membros
                  WHERE membros.nome ILIKE '%${filter}%'
                  ORDER BY membros.nome asc`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback){
        
        const query = `
            INSERT INTO membros(
                nome,
                datanasc,
                datainicio,
                foto,
                email,
                logradouro,
                usuario,
                senha,
                situacao
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `
       
        const values = [
            data.nome,
            date(data.dataNasc).iso,
            date(Date.now()).iso,
            data.foto,
            data.email,
            data.logradouro,
            data.usuario,
            CryptoJS.AES.encrypt(data.senha, 'secret key 123').toString(),
            data.situacao
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database Error!  --- ${err}`

            callback(results.rows[0])
        })

    },
    find(id, callback){
       db.query(`SELECT *
                 FROM membros
                 WHERE membros.id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
        
    },
    update(data, callback){
        const query = `
        UPDATE membros SET
            nome=($1),
            datanasc=($2),
            foto=($3),
            email=($4),
            logradouro=($5),
            situacao=($6)
        WHERE id = $7
        `
        const values = [
            data.nome,
            date(data.datanasc).iso,
            data.foto,
            data.email,
            data.logradouro,
            data.situacao,
            data.id
        ]


        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM membros WHERE id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err} `

            return callback()
        })
    },

    checkBond(id, callback){
        db.query(`SELECT * FROM membros m
                  JOIN financeiros f
                  ON m.id = f.iduser
                  WHERE m.id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`
            
            var isAchou = false
            if (results.rows.length > 0){
                isAchou = true
            }

            callback(isAchou)
        })
    }
    //instructorSelectOptions(callback){
        //db.query(`SELECT name, id FROM instructors`, function(err, results){
       //     if(err) throw `Database Error! ${err}`
//
      //      callback(results.rows)
      //  })
    //}
}