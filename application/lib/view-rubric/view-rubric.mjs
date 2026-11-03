import { config } from './config.mjs'
import mysql from 'mysql2'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const query = (sql, params) => new Promise((resolve, reject) => {
  pool.query(
    sql,
    params,
    (error, rows) => error ? reject(error.sqlMessage) : resolve(rows))
})

export const handler = async (event) => {
  try {
    if (!event.id) throw new Error("Rubric ID is required") 
      const rubrics = await query("SELECT * FROM rubric WHERE id = ?", [event.id])
    if (rubrics.length !== 1) throw new Error("Rubric not found")
    const questions = await query("SELECT * FROM question WHERE rubric_id = ?", [event.id])
    return { statusCode: 200, body: JSON.stringify({ rubric: rubrics[0], questions }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}