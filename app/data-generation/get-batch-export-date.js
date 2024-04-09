const moment = require('moment')
const { PAYMENT_EXTRACTED } = require('../constants/events')

const getBatchExportDate = (event) => {
  if (event.type === PAYMENT_EXTRACTED) {
    return moment(event.time).format()
  }
  return null
}

module.exports = {
  getBatchExportDate
}
