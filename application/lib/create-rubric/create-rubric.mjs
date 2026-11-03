import { config } from './config.mjs'
import mysql from 'mysql2'
import {randomUUID} from 'node:crypto'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const insertRubric = (id, name) => new Promise((resolve, reject) => {
  pool.query(
    "INSERT INTO rubric (id, name, low_threshold, high_threshold) VALUES (?, ?, 40, 55, 'draft')",
    [id, name],
    (error) => error ? reject(error.sqlMessage) : resolve(id))    
})

export const handler = async (event) => {
  try {
    const name = (event.name || "").trim()
    if (!name) throw new Error("Rubric name is required")
    const id = randomUUID()
    await insertRubric(id, name)
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}