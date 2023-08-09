const db = require('../../app/data')

const resetDatabase = async () => {
  await db.sequelize.truncate({ cascade: true })
}

module.exports = {
  resetDatabase
}
