const db = require('../../../../app/data')
const { createData } = require('../../../../app/warning/create-data')
const { BATCH_REJECTED, BATCH_QUARANTINED } = require('../../../../app/constants/warnings')
const { getWhereFilter } = require('../../../../app/helpers/get-where-filter')
const { updateWarning } = require('../../../../app/warning/update')

jest.mock('../../../../app/data')
jest.mock('../../../../app/warning/create-data')
jest.mock('../../../../app/helpers/get-where-filter')

describe('updateWarning', () => {
  let transaction

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
    db.reportData = {
      update: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should skip update if event type is BATCH_REJECTED', async () => {
    const event = { type: BATCH_REJECTED }

    await updateWarning(event)

    expect(createData).not.toHaveBeenCalled()
    expect(db.reportData.update).not.toHaveBeenCalled()
  })

  test('should skip update if event type is BATCH_QUARANTINED', async () => {
    const event = { type: BATCH_QUARANTINED }

    await updateWarning(event)

    expect(createData).not.toHaveBeenCalled()
    expect(db.reportData.update).not.toHaveBeenCalled()
  })

  test('should update report data with subject', async () => {
    const event = { type: 'someType', subject: 'subjectFile' }
    const dbData = { id: 1 }
    createData.mockResolvedValue(dbData)

    await updateWarning(event)

    expect(createData).toHaveBeenCalledWith(event)
    expect(db.reportData.update).toHaveBeenCalledWith({ ...dbData }, {
      where: {
        daxFileName: 'subjectFile'
      }
    })
    expect(transaction.commit).toHaveBeenCalled()
  })

  test('should update report data with where filter', async () => {
    const event = { type: 'someType', data: { someData: 'someValue' } }
    const dbData = { id: 1 }
    const where = { someField: 'someValue' }
    createData.mockResolvedValue(dbData)
    getWhereFilter.mockReturnValue(where)

    await updateWarning(event)

    expect(createData).toHaveBeenCalledWith(event)
    expect(getWhereFilter).toHaveBeenCalledWith(event)
    expect(db.reportData.update).toHaveBeenCalledWith({ ...dbData }, {
      where,
      transaction
    })
    expect(transaction.commit).toHaveBeenCalled()
  })
})
