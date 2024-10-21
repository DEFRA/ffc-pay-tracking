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
  test('should call findAll with correct where clause', async () => {
    const expectedWhereClause = {
      routedToRequestEditor: 'Y'
    }

    await getRequestEditorReportData()

    expect(db.reportData.findAll).toHaveBeenCalledWith({
      where: expectedWhereClause,
      raw: true
    })
  })
})
