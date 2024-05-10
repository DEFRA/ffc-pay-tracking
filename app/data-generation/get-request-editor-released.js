const moment = require('moment')
const { PAYMENT_QUALITY_CHECK_PASSED } = require('../constants/events')

const getRequestEditorReleased = (event) => {
  if (event.type === PAYMENT_QUALITY_CHECK_PASSED) {
    return moment(event.time).format()
  }
  return null
}

module.exports = {
  getRequestEditorReleased
}
