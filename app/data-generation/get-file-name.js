const { PAYMENT_SUBMITTED } = require('../constants/events')

const getFileName = (event) => {
  if (event.type === PAYMENT_SUBMITTED) {
    return event.subject
  }
  return null
}

module.exports = {
  getFileName
}
