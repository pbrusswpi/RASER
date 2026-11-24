import { config } from './config.mjs'
import mysql from 'mysql2'
import {randomUUID} from 'node:crypto'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
    
const copyRubric = (copyId, id) => new Promise((resolve, reject) => {
  pool.query(
    "INSERT INTO rubric (id, name, low_threshold, high_threshold) " + 
    "SELECT ?, CONCAT(name, ' (copy)'), low_threshold, high_threshold FROM rubric WHERE id = ?",
    [copyId, id],
    (error, results) => error ? reject(error.sqlMessage) : resolve(results.affectedRows))    
})

const copyQuestions = (copyId, id) => new Promise((resolve, reject) => {
  pool.query(
    "INSERT INTO question (id, rubric_id, section, text, exp5, exp4, exp3, exp2, exp1) " +
    "SELECT UUID(), ?, section, text, exp5, exp4, exp3, exp2, exp1 FROM question WHERE rubric_id = ?",
    [copyId, id],
    (error, results) => error ? reject(error.sqlMessage) : resolve()
  );
});

export const handler = async (event) => {
  try {
    const id = (event.id || "").trim()
    if (!id) throw new Error("Rubric ID is required")
    const copyId = randomUUID()
    const rows = await copyRubric(copyId, id)
    if (rows === 0) throw new Error("Rubric not found")
    await copyQuestions(copyId, id)
    return { statusCode: 200, body: JSON.stringify({ id: copyId }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}