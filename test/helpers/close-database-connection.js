const db = require('../../app/data')

const closeDatabaseConnection = async () => {
  await db.sequelize.close()
}

module.exports = {
  closeDatabaseConnection
}
