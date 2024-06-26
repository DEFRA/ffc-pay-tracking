const {
  PAYMENT_EXTRACTED,
  PAYMENT_ENRICHED,
  PAYMENT_PAUSED_CROSS_BORDER,
  PAYMENT_PAUSED_DEBT,
  PAYMENT_DEBT_ATTACHED,
  PAYMENT_PAUSED_LEDGER,
  PAYMENT_LEDGER_ASSIGNED,
  PAYMENT_PAUSED_QUALITY_CHECK,
  PAYMENT_QUALITY_CHECK_FAILED,
  PAYMENT_QUALITY_CHECK_PASSED,
  PAYMENT_RESET,
  PAYMENT_SUPPRESSED,
  PAYMENT_PROCESSED,
  PAYMENT_SUBMITTED,
  PAYMENT_ACKNOWLEDGED,
  PAYMENT_SETTLED
} = require('../constants/events')
const {
  PAYMENT_EXTRACTED_STATUS,
  PAYMENT_ENRICHED_STATUS,
  PAYMENT_PAUSED_CROSS_BORDER_STATUS,
  PAYMENT_PAUSED_DEBT_STATUS,
  PAYMENT_DEBT_ATTACHED_STATUS,
  PAYMENT_PAUSED_LEDGER_STATUS,
  PAYMENT_LEDGER_ASSIGNED_STATUS,
  PAYMENT_PAUSED_QUALITY_CHECK_STATUS,
  PAYMENT_QUALITY_CHECK_FAILED_STATUS,
  PAYMENT_QUALITY_CHECK_PASSED_STATUS,
  PAYMENT_RESET_STATUS,
  PAYMENT_SUPPRESSED_STATUS,
  PAYMENT_PROCESSED_STATUS,
  PAYMENT_SUBMITTED_STATUS,
  PAYMENT_ACKNOWLEDGED_STATUS,
  PAYMENT_SETTLED_STATUS
} = require('../constants/statuses')

const getStatus = (event) => {
  const eventMap = {}
  eventMap[PAYMENT_EXTRACTED] = PAYMENT_EXTRACTED_STATUS
  eventMap[PAYMENT_ENRICHED] = PAYMENT_ENRICHED_STATUS
  eventMap[PAYMENT_PAUSED_CROSS_BORDER] = PAYMENT_PAUSED_CROSS_BORDER_STATUS
  eventMap[PAYMENT_PAUSED_DEBT] = PAYMENT_PAUSED_DEBT_STATUS
  eventMap[PAYMENT_DEBT_ATTACHED] = PAYMENT_DEBT_ATTACHED_STATUS
  eventMap[PAYMENT_PAUSED_LEDGER] = PAYMENT_PAUSED_LEDGER_STATUS
  eventMap[PAYMENT_LEDGER_ASSIGNED] = PAYMENT_LEDGER_ASSIGNED_STATUS
  eventMap[PAYMENT_PAUSED_QUALITY_CHECK] = PAYMENT_PAUSED_QUALITY_CHECK_STATUS
  eventMap[PAYMENT_QUALITY_CHECK_FAILED] = PAYMENT_QUALITY_CHECK_FAILED_STATUS
  eventMap[PAYMENT_QUALITY_CHECK_PASSED] = PAYMENT_QUALITY_CHECK_PASSED_STATUS
  eventMap[PAYMENT_RESET] = PAYMENT_RESET_STATUS
  eventMap[PAYMENT_SUPPRESSED] = PAYMENT_SUPPRESSED_STATUS
  eventMap[PAYMENT_PROCESSED] = PAYMENT_PROCESSED_STATUS
  eventMap[PAYMENT_SUBMITTED] = PAYMENT_SUBMITTED_STATUS
  eventMap[PAYMENT_ACKNOWLEDGED] = PAYMENT_ACKNOWLEDGED_STATUS
  eventMap[PAYMENT_SETTLED] = PAYMENT_SETTLED_STATUS
  return eventMap[event.type]
}

module.exports = {
  getStatus
}
