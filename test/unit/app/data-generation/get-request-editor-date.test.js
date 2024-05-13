const { getRequestEditorDate } = require('../../../../app/data-generation/get-request-editor-date')
const moment = require('moment')
const { PAYMENT_PAUSED_DEBT } = require('../../../../app/constants/events')

describe('getRequestEditorDate', () => {
  test('should return null when no events are provided', () => {
    const events = []
    const result = getRequestEditorDate(events)
    expect(result).toBeNull()
  })
  test('should return null when there are no REQUEST_EDITOR_RELEASED events', () => {
    const events = [
      { type: 'OTHER_EVENT', date: new Date() },
      { type: 'OTHER_EVENT', date: new Date() }
    ]
    const result = getRequestEditorDate(events)
    expect(result).toBeNull()
  })
  test('should return the date when the event type is PAYMENT_PAUSED_DEBT', () => {
    const date = new Date()
    const event = { type: PAYMENT_PAUSED_DEBT, time: date }
    const result = getRequestEditorDate(event)
    expect(result).toEqual(moment(date).format())
  })
})
