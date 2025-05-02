const { PassThrough } = require('stream')
const { AP } = require('../constants/ledgers')
const db = require('../data')
const QueryStream = require('pg-query-stream')
const { saveReportFile } = require('../storage')

function toYYYYMMDD (date) {
  return date.toISOString().split('T')[0]
}

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

async function streamChunkToWriteStream (startDate, endDate, ledger, client, writeStream, rowState) {
  const valueToCheck = ledger === AP ? 'apValue' : 'arValue'
  const whereClause = {
    [valueToCheck]: { [db.Sequelize.Op.ne]: null },
    // daxFileName: { [db.Sequelize.Op.ne]: null }, // Waiting on Sam to test
    lastUpdated: { [db.Sequelize.Op.between]: [startDate, endDate] }
  }

  const whereSql = db.sequelize.getQueryInterface().queryGenerator.getWhereConditions(
    whereClause,
    db.reportData.getTableName()
  )

  const sql = `SELECT * FROM ${db.reportData.getTableName()} WHERE ${whereSql}`
  const pgStream = client.query(new QueryStream(sql, [], { batchSize: 5000 }))

  return new Promise((resolve, reject) => {
    pgStream.on('data', (row) => {
      const json = JSON.stringify(row)
      if (!rowState.firstRow) {
        writeStream.write(',\n')
      }
      writeStream.write(json)
      rowState.firstRow = false
    })

    pgStream.on('end', resolve)
    pgStream.on('error', reject)
  })
}

async function saveAPARReportDataJson (startDate, endDate, ledger) {
  console.log(`Generating AR report from ${toYYYYMMDD(startDate)} to ${toYYYYMMDD(endDate)}`)

  const filename = `ffc-pay-${ledger.toLowerCase()}-listing-report-from-${toYYYYMMDD(startDate)}-to-${toYYYYMMDD(endDate)}.json`
  const writeStream = new PassThrough()
  const client = await db.sequelize.connectionManager.getConnection()

  const savePromise = saveReportFile(filename, writeStream)

  writeStream.write('[\n') // Start of JSON file.

  const chunks = await getYearChunks(startDate, endDate)
  const rowState = { firstRow: true }

  for (let i = 0; i < chunks.length; i++) {
    console.debug(`Processing chunk ${i}`)
    await streamChunkToWriteStream(chunks[i].start, chunks[i].end, ledger, client, writeStream, rowState)
  }

  writeStream.end('\n]\n') // End of JSON file.

  await savePromise
  await db.sequelize.connectionManager.releaseConnection(client)

  console.log(`Report successfully saved to Azure Blob Storage as ${filename}`)
  return filename
}

module.exports = {
  saveAPARReportDataJson
}
