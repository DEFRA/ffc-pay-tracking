const db = require('../database')
const { pickReportDataColumns } = require('../helpers/pick-report-data-columns')
const { createData } = require('./create-data')
const { BATCH_REJECTED, BATCH_QUARANTINED } = require('../constants/warnings')
const { getWhereFilter } = require('../helpers/get-where-filter')
const { sendUpdateFailureEvent } = require('../event/send-update-failure')
const { TRACKING_UPDATE_WARNING_FAILURE } = require('../constants/events')

const updateWarning = async (event) => {
  if (![BATCH_REJECTED, BATCH_QUARANTINED].includes(event.type)) {
    const transaction = await db.transaction()
    const dbData = createData(event)
    try {
      if (event.subject) {
        await db.reportData().where({ daxFileName: event.subject }).update(pickReportDataColumns(dbData))
      } else {
        const where = getWhereFilter(event)
        if (Object.values(where).every(value => value !== null && value !== undefined)) {
          await db.reportData(transaction).where(where).update(pickReportDataColumns(dbData))
        }
      }
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      await sendUpdateFailureEvent(event?.type, TRACKING_UPDATE_WARNING_FAILURE, error.message)
      throw (error)
    }
  }
}

module.exports = {
  updateWarning
}
