import { config } from './config.mjs'
import mysql from 'mysql2'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const getRubrics = () => new Promise((resolve, reject) => {
  pool.query(
    `SELECT r.*, COUNT(q.id) AS question_count
     FROM rubric r
     LEFT JOIN question q ON q.rubric_id = r.id
     GROUP BY r.id ORDER BY r.name`,
    (error, rows) => error ? reject(error.sqlMessage) : resolve(rows))
})

export const handler = async (event) => {
  try {
    const rubrics = await getRubrics()
    return { statusCode: 200, body: JSON.stringify({ rubrics }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}