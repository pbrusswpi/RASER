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
    if (!event.rubricId) throw new Error("Rubric ID is required")
    if (!event.questionId) throw new Error("Question ID is required")

    const rubric = await query("SELECT status FROM rubric WHERE id = ?", [event.rubricId])
    if (rubric.length !== 1) throw new Error("Rubric not found")
    if (rubric[0].status !== "draft") throw new Error("Published rubrics can no longer be edited")

    const result = await query(
      "DELETE FROM question WHERE id = ? AND rubric_id = ?",
      [event.questionId, event.rubricId])
    if (result.affectedRows !== 1) throw "Question not found"
    
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}