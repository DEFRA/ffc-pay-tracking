const { getAPARReportData } = require('../../../../app/report-data/get-AP-AR-report-data')
const db = require('../../../../app/data')
const { AP, AR } = require('../../../../app/constants/ledgers')

jest.mock('../../../../app/data')

describe('getAPARReportData', () => {
  test('should return AP data when startDate and endDate are provided with AP', async () => {
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    db.reportData.findAll.mockResolvedValue(mockData)

    const startDate = new Date('2022-01-01')
    const endDate = new Date('2022-12-31')
    const result = await getAPARReportData(startDate, endDate, AP)

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

  test('should return AR data when startDate and endDate are provided with AR', async () => {
    const mockData = [{ arValue: 1 }, { arValue: 2 }]
    db.reportData.findAll.mockResolvedValue(mockData)

    const startDate = new Date('2022-01-01')
    const endDate = new Date('2022-12-31')
    const result = await getAPARReportData(startDate, endDate, AR)

    expect(result).toEqual(mockData)
    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: {
        arValue: {
          [db.Sequelize.Op.ne]: null
        },
        lastUpdated: {
          [db.Sequelize.Op.between]: [startDate, endDate]
        }
      },
      raw: true
    })
  })

  test('should return AP data when startDate and endDate are not provided with AP', async () => {
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    db.reportData.findAll.mockResolvedValue(mockData)

    const result = await getAPARReportData(null, null, AP)

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

  test('should return AR data when startDate and endDate are not provided with AR', async () => {
    const mockData = [{ apValue: 1 }, { apValue: 2 }]
    db.reportData.findAll.mockResolvedValue(mockData)

    const result = await getAPARReportData(null, null, AR)

    expect(result).toEqual(mockData)
    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: {
        arValue: {
          [db.Sequelize.Op.ne]: null
        }
      },
      raw: true
    })
  })
})
