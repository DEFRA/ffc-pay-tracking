const processRequestResponseMessage = async (message, receiver) => {
  console.log('Request response message received: ', message.body)

  await receiver.completeMessage(message)
}

module.exports = {
  processRequestResponseMessage
}
