import { config } from './config.mjs'
import mysql from 'mysql2'
import {randomUUID} from 'node:crypto'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

const addPaper = (id, issueId, title, authors, rubricId) => new Promise((resolve, reject) => {
  pool.query(
    "INSERT INTO paper (id, issue_id, title, authors, rubric_id) VALUES (?, ?, ?, ?, ?)",
    [id, issueId, title, authors, rubricId],
    (error, results) => error ? reject(error.sqlMessage) : resolve(results.insertId)
  )
})

export const handler = async (event) => {
  try {
    const issueId = (event.issueId || "").trim()
    const title = (event.title || "").trim()
    const authors = (event.authors || "").trim()
    const rubricId = (event.rubricId || "").trim()
    if (!issueId ) throw new Error("Issue ID is required")
    if (!title) throw new Error("Paper Title is required")
    if (!authors) throw new Error("Authors are required")
    if (!rubricId) throw new Error("Rubric ID is required")

    const id = randomUUID()
    await addPaper(id, issueId, title, authors, rubricId)
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}