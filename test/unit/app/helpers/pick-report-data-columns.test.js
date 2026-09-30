const { pickReportDataColumns } = require('../../../../app/helpers/pick-report-data-columns')

describe('pickReportDataColumns', () => {
  test('keeps columns that exist on the reportData table', () => {
    const data = { correlationId: 'abc', frn: 1234567890, value: 100 }

    expect(pickReportDataColumns(data)).toEqual(data)
  })

  test('drops properties that are not columns', () => {
    const result = pickReportDataColumns({ frn: 1234567890, type: 'payment', actions: [] })

    expect(result).toEqual({ frn: 1234567890 })
  })

  test('returns an empty object when given no columns', () => {
    expect(pickReportDataColumns({})).toEqual({})
  })
})
