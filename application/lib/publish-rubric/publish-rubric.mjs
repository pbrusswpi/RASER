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
    const rubrics = await query("SELECT status FROM rubric WHERE id = ?", [event.id])
    if (rubrics.length !== 1) throw new Error("Rubric not found")
    if (rubrics[0].status !== "draft") throw "Published rubrics can no longer be edited"

    const questions = await query("SELECT exp5, exp4, exp3, exp2, exp1 FROM question WHERE rubric_id = ?", [event.id])
    if (questions.length === 0) throw new Error("At least one question is required to publish a rubric")

    const maxScore = 5 * questions.length
    if (rubrics[0].high_threshold > maxScore) throw new Error(`High threshold cannot exceed maximum score of ${maxScore}`)
    
    if (rubrics[0].questions.some(q => Object.values(q).some(
     (e) => !e.trim() ))) throw new Error("Every question needs an explanation for each rating from 5 to 1");    
    await query("UPDATE rubric SET status = 'published', published_at = NOW() WHERE id = ?", [event.id])
    return { statusCode: 200, body: JSON.stringify({ id: event.id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}