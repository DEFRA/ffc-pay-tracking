const processSubmitMessage = async (message, receiver) => {
  console.log('Submit message received: ', message.body)

  await receiver.completeMessage(message)
}

module.exports = {
  processSubmitMessage
}
