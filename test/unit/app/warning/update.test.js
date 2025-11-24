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
    jest.clearAllMocks()
  })

  describe('should skip update for specific event types', () => {
    test.each([
      { type: BATCH_REJECTED },
      { type: BATCH_QUARANTINED }
    ])('skips update for event type: %s', async (event) => {
      await updateWarning(event)

      expect(createData).not.toHaveBeenCalled()
      expect(db.reportData.update).not.toHaveBeenCalled()
      expect(transaction.commit).not.toHaveBeenCalled()
    })
  })

  test.each([
    { description: 'update with subject', event: { type: 'someType', subject: 'subjectFile' }, expectedWhere: { daxFileName: 'subjectFile' } },
    { description: 'update with where filter', event: { type: 'someType', data: { someData: 'someValue' } }, expectedWhere: { someField: 'someValue' }, useGetWhereFilter: true }
  ])('should $description', async ({ event, expectedWhere, useGetWhereFilter }) => {
    const dbData = { id: 1 }
    createData.mockResolvedValue(dbData)

    if (useGetWhereFilter) {
      getWhereFilter.mockReturnValue(expectedWhere)
    }

    await updateWarning(event)

    expect(createData).toHaveBeenCalledWith(event)

    expect(db.reportData.update).toHaveBeenCalledWith(
      { ...dbData },
      useGetWhereFilter
        ? { where: expectedWhere, transaction }
        : { where: expectedWhere }
    )

    expect(transaction.commit).toHaveBeenCalled()
  })
})
