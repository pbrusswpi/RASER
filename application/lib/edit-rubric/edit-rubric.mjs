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
    const name = (event.name || "").trim()
    if (!name) throw new Error("Rubric name is required")
    const low_threshold = Number(event.low_threshold)
    const high_threshold = Number(event.high_threshold)
    if(!(low_threshold >= 0) || !(high_threshold >= 0)) throw new Error("Thresholds must be non-negative numbers")
    if (low_threshold >= high_threshold) throw new Error("Low threshold must be less than high threshold")

    const rubrics = await query("SELECT status FROM rubric WHERE id = ?", [event.id])
    if (rubrics.length !== 1) throw new Error("Rubric not found")
    if (rubrics[0].status !== "draft") throw "Published rubrics can no longer be edited"

    await query("UPDATE rubric SET name = ?, low_threshold = ?, high_threshold = ? WHERE id = ?", [name, low_threshold, high_threshold, event.id])
    return { statusCode: 200, body: JSON.stringify({ id: event.id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}