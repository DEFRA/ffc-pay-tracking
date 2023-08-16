const db = require('../../app/data')

const saveReturnMessage = async (returnMessage) => {
  const savedReturnMessage = await db.return.create(returnMessage)
  return { id: savedReturnMessage.returnId }
}

module.exports = {
  saveReturnMessage
}
