const db = require('../../../../app/data')
const { createData } = require('../../../../app/warning/create-data')
const { BATCH_REJECTED, BATCH_QUARANTINED } = require('../../../../app/constants/warnings')
const { getWhereFilter } = require('../../../../app/helpers/get-where-filter')
const { sendUpdateFailureEvent } = require('../../../../app/event/send-update-failure')
const { TRACKING_UPDATE_WARNING_FAILURE } = require('../../../../app/constants/events')
const { updateWarning } = require('../../../../app/warning/update')

jest.mock('../../../../app/data')
jest.mock('../../../../app/warning/create-data')
jest.mock('../../../../app/helpers/get-where-filter')
jest.mock('../../../../app/event/send-update-failure')

describe('updateWarning', () => {
  let transaction

  beforeEach(() => {
    jest.clearAllMocks()

    transaction = {
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue()
    }

    db.sequelize.transaction.mockResolvedValue(transaction)
    db.reportData = {
      update: jest.fn().mockResolvedValue()
    }
  })

  test.each([BATCH_REJECTED, BATCH_QUARANTINED])(
    'skips update for %s events',
    async (type) => {
      const event = { type }

      await updateWarning(event)

      expect(db.sequelize.transaction).not.toHaveBeenCalled()
      expect(createData).not.toHaveBeenCalled()
      expect(db.reportData.update).not.toHaveBeenCalled()
      expect(transaction.commit).not.toHaveBeenCalled()
    }
  )

  test('updates using the subject as the file name', async () => {
    const event = {
      type: 'some-type',
      subject: 'subject-file'
    }
    const dbData = { id: 1 }

    createData.mockReturnValue(dbData)

    await updateWarning(event)

    expect(createData).toHaveBeenCalledWith(event)
    expect(getWhereFilter).not.toHaveBeenCalled()
    expect(db.reportData.update).toHaveBeenCalledWith(
      dbData,
      { where: { daxFileName: event.subject } }
    )
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('updates using the generated where filter', async () => {
    const event = {
      type: 'some-type',
      data: { someData: 'some-value' }
    }
    const dbData = { id: 1 }
    const where = { someField: 'some-value' }

    createData.mockReturnValue(dbData)
    getWhereFilter.mockReturnValue(where)

    await updateWarning(event)

    expect(createData).toHaveBeenCalledWith(event)
    expect(getWhereFilter).toHaveBeenCalledWith(event)
    expect(db.reportData.update).toHaveBeenCalledWith(
      dbData,
      { where, transaction }
    )
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('does not update when the where filter contains a null value', async () => {
    const event = {
      type: 'some-type',
      data: { someData: 'some-value' }
    }

    createData.mockReturnValue({ id: 1 })
    getWhereFilter.mockReturnValue({
      someField: null
    })

    await updateWarning(event)

    expect(db.reportData.update).not.toHaveBeenCalled()
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('rolls back and sends a failure event when the update fails', async () => {
    const event = {
      type: 'some-type',
      subject: 'subject-file'
    }
    const error = new Error('update failed')

    createData.mockReturnValue({ id: 1 })
    db.reportData.update.mockRejectedValue(error)

    await expect(updateWarning(event)).rejects.toThrow(error)

    expect(transaction.rollback).toHaveBeenCalled()
    expect(sendUpdateFailureEvent).toHaveBeenCalledWith(
      event.type,
      TRACKING_UPDATE_WARNING_FAILURE,
      error.message
    )
    expect(transaction.commit).not.toHaveBeenCalled()
  })
})
