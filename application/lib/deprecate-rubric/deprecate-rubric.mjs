import { config } from './config.mjs'
import mysql from 'mysql2'
import {randomUUID} from 'node:crypto'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const getStatus = (id) => new Promise((resolve, reject) => {
  pool.query(
    "SELECT status FROM rubric WHERE id = ?",
    [id],
    (error, results) => error ? reject(error.sqlMessage) : resolve(results.length ? results[0].status : null)
  );
})

const markDeprecated = (id, replacedBy) => new Promise((resolve, reject) => {
  pool.query(
    "UPDATE rubric SET status = 'deprecated', deprecated_at = NOW(), replaced_by = ? WHERE id = ?",
    [replacedBy, id],
    (error) => error ? reject(error.sqlMessage) : resolve())
})

export const handler = async (event) => {
  try {
    const id = (event.id || "").trim()
    if (!id) throw new Error("Rubric ID is required")
    const status = await getStatus(id)
    if (!status) throw new Error("Rubric not found")
    if (status !== "published") throw new Error("Only published rubrics can be deprecated")
    const replacedBy = (event.replacedBy || "").trim()
    if (!replacedBy) throw new Error("Replacement rubric ID is required")
    const replacementStatus = await getStatus(replacedBy)
    if (replacedBy === id || replacementStatus !== "published")
      throw new Error("Choose a different published rubric as the replacement")
    await markDeprecated(id, replacedBy)
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}