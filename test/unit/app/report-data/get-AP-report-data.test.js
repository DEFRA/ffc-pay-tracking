const { getAPReportData } = require('../../../../app/report-data/get-AP-report-data')
const db = require('../../../../app/data')

jest.mock('../../../../app/data')

describe('getAPReportData', () => {
  test('should return data when startDate and endDate are provided', async () => {
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    db.reportData.findAll.mockResolvedValue(mockData)

    const startDate = new Date('2022-01-01')
    const endDate = new Date('2022-12-31')
    const result = await getAPReportData(startDate, endDate)

    expect(result).toEqual(mockData)
    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: {
        apValue: {
          [db.Sequelize.Op.ne]: null
        },
        lastUpdated: {
          [db.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      raw: true
    })
  })

  test('should return data when startDate and endDate are not provided', async () => {
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    db.reportData.findAll.mockResolvedValue(mockData)

    const result = await getAPReportData(null, null)

    expect(result).toEqual(mockData)
    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: {
        apValue: {
          [db.Sequelize.Op.ne]: null
        }
      },
      raw: true
    })
  })
})
