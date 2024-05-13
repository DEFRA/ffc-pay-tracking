const db = require('../../../../app/data')
const { getRequestEditorReportData } = require('../../../../app/report-data/get-request-editor-report-data')

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      ne: Symbol('ne'),
      between: Symbol('between')
    }
  },
  reportData: {
    findAll: jest.fn()
  }
}))

describe('getRequestEditorReportData', () => {
  test('should call findAll with correct where clause when startDate and endDate are provided', async () => {
    const startDate = new Date()
    const endDate = new Date()
    const expectedWhereClause = {
      receivedInRequestEditor: {
        [db.Sequelize.Op.ne]: null
      },
      lastUpdated: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    }

    await getRequestEditorReportData(startDate, endDate)

    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: expectedWhereClause,
      raw: true
    })
  })

  test('should call findAll with correct where clause when startDate and endDate are not provided', async () => {
    const expectedWhereClause = {
      receivedInRequestEditor: {
        [db.Sequelize.Op.ne]: null
      }
    }

    await getRequestEditorReportData()

    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: expectedWhereClause,
      raw: true
    })
  })
})
