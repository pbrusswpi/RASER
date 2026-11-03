import { config } from './config.mjs'
import mysql from 'mysql2'
import { randomUUID } from 'node:crypto'

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

const SECTIONS = ["Introduction", "Materials & Sourcing", "Methodology & Reproducibility",
  "Replication", "Risk of Bias & Statistics", "Reporting & Transparency"]

export const handler = async (event) => {
  try {
    if (!event.rubricId) throw new Error("Rubric ID is required")
    if (!SECTIONS.includes(event.section)) throw new Error("Unknown section")
    const text = (event.text || "").trim()
    if (!text) throw new Error("Question text is required")

    const ex = event.explanations || {}

    const rubric = await query("SELECT status FROM rubric WHERE id = ?", [event.rubricId])
    if (rubric.length !== 1) throw new Error("Rubric not found")
    if (rubric[0].status !== "draft") throw new Error("Published rubrics can no longer be edited")

    const id = randomUUID()
    await query(
      "INSERT INTO question (id, rubric_id, section, text, exp5, exp4, exp3, exp2, exp1) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, event.rubricId, event.section, text, ex[5] || "", ex[4] || "", ex[3] || "", ex[2] || "", ex[1] || ""])
    
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}