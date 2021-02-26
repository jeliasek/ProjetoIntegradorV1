const db = require('../../config/db')
const { age, date } = require('../../lib/utils')


module.exports = {
    async all(callback){

        db.query(`SELECT * FROM eventos ORDER BY datainicio`, function(err,results){
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    allOfMember(idMembro, callback){
        db.query(`SELECT e.id AS id, e.descricao AS descricao, e.valor AS valor, me.idmembro AS participa FROM eventos e LEFT JOIN membrosevento me on me.idevento = e.id AND me.idmembro = ${idMembro}
                  WHERE idmembro isNull OR idmembro = ${idMembro}`, function(err,results){
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    findByOfMember(idMembro, filter, callback){
        
        db.query(`SELECT e.id AS id, e.descricao AS descricao, e.valor AS valor, me.idmembro AS participa 
                  FROM eventos e LEFT JOIN membrosevento me on me.idevento = e.id AND me.idmembro = ${idMembro}
                  WHERE e.descricao ILIKE '%${filter}%'
                  AND (me.idmembro isNull OR me.idmembro = ${idMembro})
                  ORDER BY e.datainicio asc`, function(err,results){
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    findBy(filter, callback){
        
        db.query(`SELECT eventos.*
                  FROM eventos
                  WHERE eventos.descricao ILIKE '%${filter}%'
                  ORDER BY eventos.datainicio asc`, function(err,results){
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    create(data, callback){
        
        const query = `
            INSERT INTO eventos(
                descricao,
                datainicio,
                datafim,
                valor
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
        `

        const values = [
            data.descricao,
            date(data.datainicio).iso,
            date(data.datafim).iso,
            data.valor
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database Error!  --- ${err}`

            callback(results.rows[0])
        })

    },
    find(id, callback){
       db.query(`SELECT *
                 FROM eventos
                 WHERE eventos.id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
        
    },
    update(data, callback){
        const query = `
        UPDATE eventos SET
            descricao=($1),
            datainicio=($2),
            datafim=($3),
            valor=($4)
        WHERE id = $5
        `
        const values = [
            data.descricao,
            date(data.datainicio).iso,
            date(data.datafim).iso,
            data.valor,
            data.id
        ]


        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM eventos WHERE id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err} `

            return callback()
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