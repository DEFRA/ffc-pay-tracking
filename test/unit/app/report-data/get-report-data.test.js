const db = require('../../../../app/data')
const { getReportData } = require('../../../../app/report-data/get-report-data')

jest.mock('../../../../app/data', () => ({
  reportData: {
    findAll: jest.fn()
  }
}))

test('getReportData returns all report data', async () => {
  const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }]
  db.reportData.findAll.mockResolvedValue(mockData)

  const result = await getReportData()

  expect(result).toEqual(mockData)
  expect(db.reportData.findAll).toHaveBeenCalledWith({ raw: true })
})
