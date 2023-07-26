const processReturnMessage = async (message, receiver) => {
  console.log('Return message received: ', message.body)

  await receiver.completeMessage(message)
}

module.exports = {
  processReturnMessage
}
