import { config } from './config.mjs'
import mysql from 'mysql2'
import {randomUUID} from 'node:crypto'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const deleteIssue = (id) => new Promise((resolve, reject) => {
  pool.query(
    "DELETE FROM issue WHERE id = ?",
    [id],
    (error, results) => error ? reject(error.sqlMessage) : resolve(results.affectedRows)
  )
})

export const handler = async (event) => {
  try {
    const id = (event.issueId || "").trim()
    if (!id) throw new Error("Issue ID is required")
    // TODO iteration 3: block if reviewers assigned
      const rows = await deleteIssue(id)
    if (rows === 0) throw new Error("Issue not found")
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}