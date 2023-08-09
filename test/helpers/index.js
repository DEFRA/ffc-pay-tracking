const { resetDatabase } = require('./reset-database')
const { closeDatabaseConnection } = require('./close-database-connection')

module.exports = {
  resetDatabase,
  closeDatabaseConnection
}
