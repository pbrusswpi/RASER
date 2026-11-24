import { config } from './config.mjs'
import mysql from 'mysql2'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const getJournals = () => new Promise((resolve, reject) => {
  pool.query(
    `SELECT id, name, status FROM journal ORDER BY name`,
    (error, rows) => error ? reject(error.sqlMessage) : resolve(rows))
})

export const handler = async (event) => {
  try {
    const journals = await getJournals()
    return { statusCode: 200, body: JSON.stringify({ journals }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}