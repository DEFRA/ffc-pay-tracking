const moment = require('moment')
const { getRequestEditorReleased } = require('../../../../app/data-generation/get-request-editor-released')
const { PAYMENT_QUALITY_CHECK_PASSED } = require('../../../../app/constants/events')

describe('getRequestEditorReleased', () => {
  test('should return null when the event type is not PAYMENT_QUALITY_CHECK_PASSED', () => {
    const event = { type: 'OTHER_EVENT', time: new Date() }
    const result = getRequestEditorReleased(event)
    expect(result).toBeNull()
  })

  test('should return the date when the event type is PAYMENT_QUALITY_CHECK_PASSED', () => {
    const date = new Date()
    const event = { type: PAYMENT_QUALITY_CHECK_PASSED, time: date }
    const result = getRequestEditorReleased(event)
    expect(result).toEqual(moment(date).format())
  })
})
