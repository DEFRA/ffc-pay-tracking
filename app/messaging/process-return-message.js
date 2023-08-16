const util = require('util')
const { saveReturnMessage } = require('../inbound')

const processReturnMessage = async (message, receiver) => {
  try {
    console.log('Return message received:', util.inspect(message.body, false, null, true))
    await saveReturnMessage(message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process return message:', err)
  }
}

module.exports = {
  processReturnMessage
}
