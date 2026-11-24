import { config } from './config.mjs'
import mysql from 'mysql2'
import {randomUUID} from 'node:crypto'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const registerJournal = (id, name) => new Promise((resolve, reject) => {
  pool.query(
    "INSERT INTO journal (id, name) VALUES (?, ?)",
    [id, name],
    (error) => error ? reject(error.sqlMessage) : resolve(id))    
})

export const handler = async (event) => {
  try {
    const name = (event.name || "").trim()
    if (!name) throw new Error("Journal name is required")
    const id = randomUUID()
    await registerJournal(id, name)
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}