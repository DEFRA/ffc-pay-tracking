const Hapi = require('@hapi/hapi')
const { GET } = require('../../../../app/constants/methods')
const { getFilteredReportData } = require('../../../../app/report-data/get-filtered-report-data')
const paymentRequestsReport = require('../../../../app/server/routes/payment-requests')

jest.mock('../../../../app/report-data/get-filtered-report-data')

describe('GET /payment-requests-report', () => {
  let server

  beforeEach(async () => {
    server = Hapi.server()
    server.route(paymentRequestsReport)
    await server.initialize()
  })
  afterEach(async () => {
    await server.stop()
  })

  test('responds with 200 and paymentRequestsReportData', async () => {
    const mockData = [{ field1: 'string1', field2: 1 }]
    getFilteredReportData.mockResolvedValue(mockData)

    const options = {
      method: GET,
      url: '/payment-requests-report',
      payload: {
        schemeId: 1,
        year: 2025,
        revenueOrCapital: 'Revenue',
        prn: 1,
        frn: 1234567890
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual({ paymentRequestsReportData: mockData })
  })
})
