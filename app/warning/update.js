const db = require('../data')
const { createData } = require('./create-data')
const { BATCH_REJECTED, BATCH_QUARANTINED } = require('../constants/warnings')
const { getWhereFilter } = require('../helpers/get-where-filter')
const { sendUpdateFailureEvent } = require('../event/send-update-failure')
const { TRACKING_UPDATE_WARNING_FAILURE } = require('../constants/events')

const updateWarning = async (event) => {
  if (![BATCH_REJECTED, BATCH_QUARANTINED].includes(event.type)) {
    const transaction = await db.sequelize.transaction()
    const dbData = await createData(event)
    try {
      if (event.subject) {
        await db.reportData.update({ ...dbData }, {
          where: {
            daxFileName: event.subject
          }
        })
      } else {
        const where = getWhereFilter(event)
        if (Object.values(where).every(value => value !== null && value !== undefined)) {
          await db.reportData.update({ ...dbData }, {
            where,
            transaction
          })
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
