// report-data/save-AP-AR-report-data.js
const fs = require('fs')
const path = require('path')
const { AP } = require('../constants/ledgers')
const db = require('../data')
const QueryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
const async = require('async') // Import async package

async function getYearChunks (startDate, endDate) {
  const chunks = []
  let current = new Date(startDate.getFullYear(), 0, 1)
  while (current < endDate) {
    const yearEnd = new Date(current.getFullYear() + 1, 0, 1)
    chunks.push({
      start: new Date(current),
      end: yearEnd > endDate ? new Date(endDate) : yearEnd
    })
    current = yearEnd
  }
  return chunks
}

async function streamChunkToJsonFile (startDate, endDate, ledger, chunkIndex) {
  const valueToCheck = ledger === AP ? 'apValue' : 'arValue'
  const whereClause = {
    [valueToCheck]: { [db.Sequelize.Op.ne]: null },
    daxFileName: { [db.Sequelize.Op.ne]: null },
    lastUpdated: { [db.Sequelize.Op.between]: [startDate, endDate] }
  }

  const client = await db.sequelize.connectionManager.getConnection()
  const whereSql = db.sequelize.getQueryInterface().queryGenerator.getWhereConditions(
    whereClause,
    db.reportData.getTableName()
  )

  const sql = `SELECT * FROM ${db.reportData.getTableName()} WHERE ${whereSql}`
  const pgStream = client.query(new QueryStream(sql, [], { batchSize: 1000 }))

  const outFilePath = path.join(__dirname, `ar-report-chunk-${chunkIndex}.json`)
  const jsonStream = JSONStream.stringify('[', ',', ']')
  const writeStream = fs.createWriteStream(outFilePath)

  return new Promise((resolve, reject) => {
    writeStream
      .on('finish', async () => {
        await db.sequelize.connectionManager.releaseConnection(client)
        console.log(`✅ Finished chunk ${chunkIndex}: ${outFilePath}`)
        resolve(outFilePath)
      })
      .on('error', reject)

    pgStream
      .on('error', async (err) => {
        await db.sequelize.connectionManager.releaseConnection(client)
        console.error(`❌ Error in chunk ${chunkIndex}`, err)
        reject(err)
      })
      .pipe(jsonStream)
      .pipe(writeStream)
  })
}

async function saveAPARReportDataJson (startDate, endDate, ledger) {
  const chunks = await getYearChunks(startDate, endDate)

  // Use async.parallelLimit to manage concurrency
  const filePaths = await new Promise((resolve, reject) => {
    async.parallelLimit(
      chunks.map((chunk, index) => {
        return (callback) => {
          streamChunkToJsonFile(chunk.start, chunk.end, ledger, index)
            .then(filePath => callback(null, filePath))
            .catch(callback)
        }
      }),
      3, // Limit to 3 concurrent tasks
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })

  return filePaths
}

module.exports = {
  saveAPARReportDataJson
}
