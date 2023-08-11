const db = require('../../app/data')

const saveReturnMessage = async (returnMessage) => {
  const savedReturnMessage = await db.returns.create(returnMessage)
  return { id: savedReturnMessage.returnsId }
}

module.exports = {
  saveReturnMessage
}
