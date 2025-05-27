const { PassThrough } = require('stream')
const QueryStream = require('pg-query-stream')
const db = require('../data')
const { saveReportFile } = require('../storage')

const generateUniqueFilename = (prefix = 'default', ext = 'json') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefix}-${timestamp}.${ext}`
}

const streamRowsAsJsonArray = (pgStream, outputStream) => new Promise((resolve, reject) => {
  let isFirstRow = true
  outputStream.write('[\n')

  pgStream.on('data', (row) => {
    const json = JSON.stringify(row)
    if (!isFirstRow) {
      outputStream.write(',\n')
    }
    outputStream.write(json)
    isFirstRow = false
  })

  pgStream.on('end', () => {
    outputStream.end('\n]\n')
    resolve()
  })

  pgStream.on('error', reject)
})

const createStreamingQuery = (sql, client, batchSize = 5000) => client.query(new QueryStream(sql, [], { batchSize }))

const getDbClient = async () =>
  db.sequelize.connectionManager.getConnection()

const releaseDbClient = async (client) =>
  db.sequelize.connectionManager.releaseConnection(client)

const exportQueryToJsonFile = async (sql, fileIdentifier = undefined, batchSize = 5000) => {
  const client = await getDbClient()
  const passThrough = new PassThrough()

  try {
    const filename = generateUniqueFilename(fileIdentifier)
    const pgStream = createStreamingQuery(sql, client, batchSize)
    const savePromise = saveReportFile(filename, passThrough)
    await streamRowsAsJsonArray(pgStream, passThrough)
    await savePromise
    console.log(`Report saved to storage as: ${filename}`)
    return filename
  } catch (err) {
    console.error('Failed to export report:', err)
    throw err
  } finally {
    await releaseDbClient(client)
  }
}

const generateSqlQuery = (whereClause = null) => {
  const tableName = db.reportData.getTableName()
  const baseQuery = `SELECT * FROM ${tableName}`

  if (!whereClause) {
    return baseQuery
  }

  const queryGenerator = db.sequelize.getQueryInterface().queryGenerator
  const whereSql = queryGenerator.getWhereConditions(whereClause, tableName)
  return `${baseQuery} WHERE ${whereSql}`
}

module.exports = { generateSqlQuery, exportQueryToJsonFile }
