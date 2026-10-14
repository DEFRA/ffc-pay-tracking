const TABLES = require('../../../../app/constants/tables')
const { pickColumns } = require('../../../../app/constants/columns')

describe('pickColumns', () => {
  test('keeps columns that exist on the reportData table', () => {
    const data = { correlationId: 'abc', frn: 1234567890, value: 100 }

    expect(pickColumns(data, TABLES.reportData)).toEqual(data)
  })

  test('drops properties that are not columns', () => {
    const result = pickColumns({ frn: 1234567890, type: 'payment', actions: [] }, TABLES.reportData)

    expect(result).toEqual({ frn: 1234567890 })
  })

  test('returns an empty object when given no columns', () => {
    expect(pickColumns({}, TABLES.reportData)).toEqual({})
  })
})
