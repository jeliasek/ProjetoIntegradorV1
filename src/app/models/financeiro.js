const db = require('../../config/db')
const { age, date } = require('../../lib/utils')

module.exports = {
    all(callback){

        db.query(`SELECT f.*, m.nome as nomemembro FROM financeiros f JOIN Membros m ON f.iduser = m.id ORDER BY descricao`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    allOfMember(id,callback){

        db.query(`SELECT f.*, m.nome as nomemembro FROM financeiros f JOIN Membros m ON f.iduser = m.id where m.id = ${id} ORDER BY descricao`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    findBy(filter, callback){
        
        db.query(`SELECT financeiros.*, m.nome as nomemembro
                  FROM financeiros f JOIN membros m ON
                  f.iduser = m.id
                  WHERE f.descricao ILIKE '%${filter}%'
                  ORDER BY f.descricao asc`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    findByOfMember(filter, id, callback){
        
        db.query(`SELECT financeiros.*, m.nome as nomemembro
                  FROM financeiros f JOIN membros m ON
                  f.iduser = m.id
                  WHERE f.descricao ILIKE '%${filter}%'
                  AND b.id = ${id}
                  ORDER BY f.descricao asc`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback){
        
        const query = `
            INSERT INTO financeiros(
                descricao,
                tipo,
                ispago,
                valor,
                iduser
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `

        const values = [
            data.descricao,
            data.tipo,
            data.ispago,
            data.valor,
            data.user
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database Error!  --- ${err}`

            callback(results.rows[0])
        })

    },
    find(id, callback){
        db.query(`SELECT financeiros.*, membros.nome AS user_name
                  FROM financeiros
                  LEFT JOIN membros on (financeiros.iduser = membros.id)
                  WHERE financeiros.id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
        
    },
    update(data, callback){
        const query = `
        UPDATE financeiros SET
            descricao=($1),
            tipo=($2),
            ispago=($3),
            valor=($4),
            iduser=($5)
        WHERE id = ($6)
        `
        
        const values = [
            data.descricao,
            data.tipo,
            data.ispago,
            data.valor,
            data.user,
            data.id
        ]


        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM financeiros WHERE id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err} `

            return callback()
        })
    },
    usersSelectOptions(callback){
        db.query(`SELECT nome, id FROM membros`, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    }
}