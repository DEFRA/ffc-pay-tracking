const db = require('../data')
const { PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS } = require('../constants/statuses')
const { getStatus } = require('./get-status')
const { Op } = require('sequelize')
const { getDataFilter } = require('../helpers/get-data-filter')

const checkDAXPRN = async (event, transaction) => {
  const status = getStatus(event)
  if ([PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS].includes(status)) {
    return event.data.paymentRequestNumber
  }

  const where = getDataFilter(event.data)
  where.paymentRequestNumber = {
    [Op.lte]: event.data.paymentRequestNumber
  }

  const previousRequests = await db.reportData.findAll({
    where,
    transaction,
    order: [['paymentRequestNumber', 'DESC']]
  })

  for (const previousRequest of previousRequests) {
    if ([PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS].includes(previousRequest.status)) {
      return previousRequest.paymentRequestNumber
    }
  }

  return 0
}

module.exports = {
  checkDAXPRN
}
