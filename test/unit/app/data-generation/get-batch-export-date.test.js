const { getBatchExportDate } = require('../../../../app/data-generation/get-batch-export-date')
const { PAYMENT_EXTRACTED } = require('../../../../app/constants/events')
const moment = require('moment')

describe('getBatchExportDate', () => {
  test('should return null if event type is not PAYMENT_EXTRACTED', () => {
    const event = { type: 'OTHER_EVENT', time: '2022-01-01T00:00:00Z' }
    expect(getBatchExportDate(event)).toBeNull()
  })

  test('should return the formatted date if event type is PAYMENT_EXTRACTED', () => {
    const event = { type: PAYMENT_EXTRACTED, time: '2022-01-01T00:00:00Z' }
    expect(getBatchExportDate(event)).toBe(moment(event.time).format())
  })
})
