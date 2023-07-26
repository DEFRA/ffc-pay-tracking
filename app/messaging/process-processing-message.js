const processProcessingMessage = async (message, receiver) => {
  console.log('Processing message received: ', message.body)

  await receiver.completeMessage(message)
}

module.exports = {
  processProcessingMessage
}
