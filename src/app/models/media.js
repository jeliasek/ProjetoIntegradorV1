const db = require('../../config/db')
const { age, date } = require('../../lib/utils')


module.exports = {
    all(callback) {

        db.query(`SELECT * FROM medias ORDER BY descricao`, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    findBy(filter, callback) {

        db.query(`SELECT medias.*
                  FROM medias
                  WHERE medias.descricao ILIKE '%${filter}%'
                  ORDER BY medias.descricao`, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {

        const query = `
            INSERT INTO medias(
                descricao,
                link
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.descricao,
            data.link
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Database Error!  --- ${err}`

            callback(results.rows[0])
        })

    },
    find(id, callback) {
        db.query(`SELECT *
                 FROM medias
                 WHERE medias.id = $1`, [id], function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })

    },
    update(data, callback) {
        const query = `
        UPDATE medias SET
            descricao=($1),
            link=($2)
        WHERE id = $3
        `
        const values = [
            data.descricao,
            data.link,
            data.id
        ]


        db.query(query, values, function (err, results) {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM medias WHERE id = $1`, [id], function (err, results) {
            if (err) throw `Database Error! ${err} `

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