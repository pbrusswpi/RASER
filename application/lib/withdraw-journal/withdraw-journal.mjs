import { config } from './config.mjs'
import mysql from 'mysql2'
import {randomUUID} from 'node:crypto'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const withdrawJournal = (id) => new Promise((resolve, reject) => {
  pool.query(
    "UPDATE journal SET status = 'withdrawn' WHERE id = ?",
    [id],
    (error, results) => error ? reject(error.sqlMessage) : resolve(results.affectedRows))    
})

export const handler = async (event) => {
  try {
    const id = (event.id || "").trim()
    if (!id) throw new Error("Journal ID is required")
    const rows = await withdrawJournal(id)
    if (rows === 0) throw new Error("Journal not found")
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}