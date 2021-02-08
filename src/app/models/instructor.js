const db = require('../../config/db')
const { age, date } = require('../../lib/utils')


module.exports = {
    all(callback){

        db.query(`SELECT instructors.*, COUNT(members) AS total_students
                  FROM instructors
                  LEFT JOIN members ON (instructors.id = members.instructor_id)
                  GROUP BY instructors.id
                  ORDER BY instructors.name asc`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback){
        
        const query = `
            INSERT INTO instructors(
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,
            date(Date.now()).iso,
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })

    },
    find(id, callback){
        
        db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
        
    },
    update(data, callback){
        const query = `
        UPDATE instructors SET
            avatar_url=($1),
            name=($2),
            birth=($3),
            gender=($4),
            services=($5)
        WHERE id = $6
        `
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.gender,
            data.services,
            data.id
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM instructors WHERE id = $1`, [id], function(err, results){
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },
    findBy(filter, callback){
        
        db.query(`SELECT instructors.*, COUNT(members) AS total_students
                  FROM instructors
                  LEFT JOIN members ON (instructors.id = members.instructor_id)
                  WHERE instructors.name ILIKE '%${filter}%'
                  OR instructors.services ILIKE '%${filter}%'
                  GROUP BY instructors.id
                  ORDER BY instructors.name asc`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    findMembers(id, filter, callback){
        if(!filter) filter = ''
        
        db.query(`SELECT *
                  FROM members
                  WHERE instructor_id = ${id}
                  AND name ILIKE '%${filter}%'
                  ORDER BY members.name asc`, function(err,results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    }

}