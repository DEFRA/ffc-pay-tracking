const { GET } = require('../../../../../app/constants/methods')
const { getReportData } = require('../../../../../app/report-data/get-report-data')
const reportDataRoutes = require('../../../../../app/server/routes/report-data')

jest.mock('../../../../../app/report-data/get-report-data')

test('GET /report-data route returns report data', async () => {
  const mockReportData = { test: 'data' }
  getReportData.mockResolvedValue(mockReportData)

  const route = reportDataRoutes.find(route => route.method === GET && route.path === '/report-data')
  const mockH = {
    response: jest.fn().mockReturnThis(),
    code: jest.fn()
  }

  const result = await route.options.handler({}, mockH)

  expect(getReportData).toHaveBeenCalled()
  expect(mockH.response).toHaveBeenCalledWith({ reportData: mockReportData })
  expect(result).toBe(mockH)
})
