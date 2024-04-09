const { updateWarning } = require('../../../../app/warning/update')
const { createData } = require('../../../../app/warning/create-data')
const { getWhereFilter } = require('../../../../app/get-where-filter')
const db = require('../../../../app/data')

jest.mock('../../../../app/warning/create-data')
jest.mock('../../../../app/get-where-filter')
jest.mock('../../../../app/data')

test('updateWarning function updates report data', async () => {
  const mockEvent = { type: 'test', subject: 'test' }
  const mockData = { test: 'data' }
  const mockTransaction = { commit: jest.fn(), rollback: jest.fn() }
  const mockWhere = { test: 'where' }

  db.sequelize.transaction.mockResolvedValue(mockTransaction)
  createData.mockResolvedValue(mockData)
  getWhereFilter.mockReturnValue(mockWhere)
  db.reportData.update.mockResolvedValue()

  await updateWarning(mockEvent)

  expect(db.sequelize.transaction).toHaveBeenCalled()
  expect(createData).toHaveBeenCalledWith(mockEvent)
  expect(db.reportData.update).toHaveBeenCalledWith({ ...mockData }, {
    where: {
      daxFileName: mockEvent.subject
    }
  })
  expect(mockTransaction.commit).toHaveBeenCalled()
  expect(mockTransaction.rollback).not.toHaveBeenCalled()
})
