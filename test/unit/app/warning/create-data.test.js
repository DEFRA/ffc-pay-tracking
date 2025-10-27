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
  const mockPHError = 'ph error'.repeat(40)
  const mockDAXError = 'dax error'.repeat(40)

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

test('should not include phError or daxError when both are null', () => {
  const mockEvent = { time: new Date() }
  const mockStatus = 'ok'

  getWarningStatus.mockReturnValue(mockStatus)
  getPHError.mockReturnValue(null)
  getDAXError.mockReturnValue(null)

  const result = createData(mockEvent)

  expect(result).toEqual({
    status: mockStatus,
    lastUpdated: moment(mockEvent.time).format()
  })
  expect(result).not.toHaveProperty('phError')
  expect(result).not.toHaveProperty('daxError')
})

test('should not include phError if getPHError returns undefined', () => {
  const mockEvent = { time: new Date() }
  const mockStatus = 'warning'
  const mockDAXError = 'some dax error'

  getWarningStatus.mockReturnValue(mockStatus)
  getPHError.mockReturnValue(undefined)
  getDAXError.mockReturnValue(mockDAXError)

  const result = createData(mockEvent)

  expect(result).toEqual({
    status: mockStatus,
    lastUpdated: moment(mockEvent.time).format(),
    daxError: mockDAXError
  })
  expect(result).not.toHaveProperty('phError')
})

test('should not include daxError if getDAXError returns undefined', () => {
  const mockEvent = { time: new Date() }
  const mockStatus = 'warning'
  const mockPHError = 'some ph error'

  getWarningStatus.mockReturnValue(mockStatus)
  getPHError.mockReturnValue(mockPHError)
  getDAXError.mockReturnValue(undefined)

  const result = createData(mockEvent)

  expect(result).toEqual({
    status: mockStatus,
    lastUpdated: moment(mockEvent.time).format(),
    phError: mockPHError
  })
  expect(result).not.toHaveProperty('daxError')
})
