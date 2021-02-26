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
                situacao,
                isdiretor
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
            data.situacao,
            data.isdiretor
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
            situacao=($6),
            isdiretor=($7),
            senha=($8)
        WHERE id = $9
        `
        const values = [
            data.nome,
            date(data.datanasc).iso,
            data.foto,
            data.email,
            data.logradouro,
            data.situacao,
            data.isdiretor,
            CryptoJS.AES.encrypt(data.senha, 'secret key 123').toString(),
            data.id
        ]


        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    updatePrivate(data, callback){

        const query = `
        UPDATE membros SET
            nome=($1),
            datanasc=($2),
            foto=($3),
            email=($4),
            logradouro=($5),
            situacao=($6),
            senha=($7)
        WHERE id = $8
        `
        const values = [
            data.nome,
            date(data.datanasc).iso,
            data.foto,
            data.email,
            data.logradouro,
            data.situacao,
            CryptoJS.AES.encrypt(data.senha, 'secret key 123').toString(),
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
    },

    checkUser(usuario, callback){
        db.query(`SELECT * FROM membros
                  WHERE usuario = '${usuario}'`, function(err,results){
                      if(err) throw `Database Error! ${err}`

                      callback(results.rows[0])
                  })
        
    },
    incrementaTentativa(usuario, callback){
        const query = `
        UPDATE membros SET
            tentativas = tentativas + 1
        WHERE usuario = '${usuario}'
        `

        db.query(query, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    zeraTentativas(usuario, callback){
        const query = `
        UPDATE membros SET
            tentativas = 0
        WHERE usuario = '${usuario}'
        `

        db.query(query, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    zeraTentativasId(id, callback){
        const query = `
        UPDATE membros SET
            tentativas = 0
        WHERE id = ${id}
        `

        db.query(query, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
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