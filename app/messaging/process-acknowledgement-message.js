const processAcknowledgementMessage = async (message, receiver) => {
  console.log('Acknowledgement message received: ', message.body)

  await receiver.completeMessage(message)
}

module.exports = {
  processAcknowledgementMessage
}
