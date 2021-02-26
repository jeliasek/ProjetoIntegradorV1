const db = require('../../config/db')
const { age, date } = require('../../lib/utils')


module.exports = {
    all(callback){

        db.query(`SELECT * FROM encontros ORDER BY data`, function(err,results){
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    allOfMember(idMembro, callback){

        db.query(`SELECT e.id AS id, e.descricao AS descricao, e.data AS data, me.idmembro AS participa 
                  FROM encontros e LEFT JOIN membrosencontro me on me.idencontro = e.id AND me.idmembro = ${idMembro}
                  WHERE idmembro isNull OR idmembro = ${idMembro}`, function(err,results){
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    findBy(filter, callback){
        
        db.query(`SELECT encontros.*
                  FROM encontros
                  WHERE encontros.descricao ILIKE '%${filter}%'
                  ORDER BY encontros.data asc`, function(err,results){
            if(err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    create(data, callback){
        
        const query = `
            INSERT INTO encontros(
                descricao,
                data
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.descricao,
            date(data.data).iso
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database Error!  --- ${err}`

            callback(results.rows[0])
        })

    },
    find(id, callback){
       db.query(`SELECT *
                 FROM encontros
                 WHERE encontros.id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
        
    },
    update(data, callback){
        const query = `
        UPDATE encontros SET
            descricao=($1),
            data=($2)
        WHERE id = $3
        `
        const values = [
            data.descricao,
            date(data.data).iso,
            data.id
        ]


        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM encontros WHERE id = $1`, [id], function(err, results){
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