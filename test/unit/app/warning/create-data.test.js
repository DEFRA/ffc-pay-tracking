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

test('should trim the lengths of phError and daxError to no more than 255 chars', () => {
  const mockEvent = { time: new Date() }
  const mockStatus = 'warning'
  const mockPHError = 'ph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph errorph error'
  const mockDAXError = 'dax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax errordax error'

  getWarningStatus.mockReturnValue(mockStatus)
  getPHError.mockReturnValue(mockPHError)
  getDAXError.mockReturnValue(mockDAXError)

  const result = createData(mockEvent)

  expect(getWarningStatus).toHaveBeenCalledWith(mockEvent)
  expect(getPHError).toHaveBeenCalledWith(mockEvent)
  expect(getDAXError).toHaveBeenCalledWith(mockEvent)
  expect(result.phError).toEqual(mockPHError.substring(0, 255))
  expect(result.daxError).toEqual(mockDAXError.substring(0, 255))
})
