import { config } from './config.mjs'
import mysql from 'mysql2'
import {randomUUID} from 'node:crypto'

var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

const countIssue = (journalId, volume, number) => new Promise((resolve, reject) => {
  pool.query(
    "SELECT COUNT(*) AS n FROM issue WHERE journal_id = ? AND volume = ? AND number = ?",
    [journalId, volume, number],
    (error, results) => error ? reject(error.sqlMessage) : resolve(results[0].n)
  )
})

const insertIssue = (id, journalId, volume, number) => new Promise((resolve, reject) => {
  pool.query(
    "INSERT INTO issue (id, journal_id, volume, number) VALUES (?,?, ?, ?)",
    [id, journalId, volume, number],
    (error, results) => error ? reject(error.sqlMessage) : resolve(results.insertId)
  )
})

export const handler = async (event) => {
  try {
    const journalId = (event.journalId || "").trim()
    const volume = Number(event.volume)
    const number = Number(event.number)
    if (!journalId ) throw new Error("Journal ID is required")
    if (!Number.isInteger(volume) || volume < 1 || !Number.isInteger(number) || number < 1 || number > 12)
      throw new Error("Volume must be 1 or more and Number must be between 1 and 12")
    const n = await countIssue(journalId, volume, number)
    if (n > 0) throw new Error("That issue already exists")
    const id = randomUUID()
    await insertIssue(id, journalId, volume, number)
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: String(error) }) }
  }
}