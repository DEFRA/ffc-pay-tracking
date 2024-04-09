const moment = require('moment')
const { createData } = require('../../../../app/warning/create-data')
const { getWarningStatus, getPHError, getDAXError } = require('../../../../app/data-generation/index')

jest.mock('../../../../app/data-generation/index')

test('createData function returns correct data', () => {
  const mockEvent = { time: new Date() }
  const mockStatus = 'warning'
  const mockPHError = 'ph error'
  const mockDAXError = 'dax error'

  getWarningStatus.mockReturnValue(mockStatus)
  getPHError.mockReturnValue(mockPHError)
  getDAXError.mockReturnValue(mockDAXError)

  const result = createData(mockEvent)

  expect(getWarningStatus).toHaveBeenCalledWith(mockEvent)
  expect(getPHError).toHaveBeenCalledWith(mockEvent)
  expect(getDAXError).toHaveBeenCalledWith(mockEvent)
  expect(result).toEqual({
    status: mockStatus,
    lastUpdated: moment(mockEvent.time).format(),
    phError: mockPHError,
    daxError: mockDAXError
  })
})
