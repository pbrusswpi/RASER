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
    if (rubrics[0].status !== "draft") throw "Once published, a rubric cannot be deleted"
    await query("DELETE FROM rubric WHERE id = ?", [event.id])
    return { statusCode: 200, body: JSON.stringify({ id: event.id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}