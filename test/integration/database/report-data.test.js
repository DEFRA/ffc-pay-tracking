const db = require('../../../app/database')
const { truncate } = require('../../helpers/truncate')
const { createDBFromExisting } = require('../../../app/payment/create-db-from-existing')
const { getExistingDataPartial } = require('../../../app/payment/get-existing-data-partial')
const { updateExistingRecord } = require('../../../app/payment/update-existing-record')
const { removeReportData } = require('../../../app/retention/remove-report-data')
const { generateSqlQuery } = require('../../../app/report-data/report-file-generator')

const baseRow = {
  correlationId: '11111111-1111-1111-1111-111111111111',
  frn: 1234567890,
  agreementNumber: 'AG1',
  invoiceNumber: 'S1234567A123456V001',
  sourceSystem: 'SFI',
  paymentRequestNumber: 1,
  value: 100
}

describe('reportData queries against Postgres', () => {
  beforeEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await truncate()
    await db.close()
  })

  test('createDBFromExisting drops properties that are not columns and defaults the rest', async () => {
    await createDBFromExisting({ ...baseRow, type: 'not-a-column' }, { value: 5, batch: 'B1' })

    const rows = await db.reportData()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ frn: '1234567890', value: 5, batch: 'B1', ledgerSplit: 'Y' })
  })

  test('getExistingDataPartial returns the row, or null when there is none', async () => {
    await db.reportData().insert(baseRow)

    expect(await getExistingDataPartial(baseRow.correlationId)).toMatchObject({ invoiceNumber: baseRow.invoiceNumber })
    expect(await getExistingDataPartial('missing')).toBeNull()
  })

  test('getExistingDataPartial locks the row for the duration of a transaction', async () => {
    await db.reportData().insert(baseRow)
    const trx = await db.transaction()

    try {
      expect(await getExistingDataPartial(baseRow.correlationId, trx)).not.toBeNull()

      const skipped = await db.reportData().where({ correlationId: baseRow.correlationId }).forUpdate().skipLocked()
      expect(skipped).toHaveLength(0)
    } finally {
      await trx.rollback()
    }
  })

  test('updateExistingRecord updates only the matching invoice inside a transaction', async () => {
    await db.reportData().insert([baseRow, { ...baseRow, correlationId: '22222222-2222-2222-2222-222222222222', invoiceNumber: 'OTHER' }])
    const trx = await db.transaction()
    await updateExistingRecord({ status: 'Settled', lastUpdated: new Date() }, baseRow.invoiceNumber, trx)
    await trx.commit()

    const rows = await db.reportData().orderBy('invoiceNumber')
    expect(rows.find(row => row.invoiceNumber === baseRow.invoiceNumber)).toMatchObject({ status: 'Settled', ledgerSplit: 'Y' })
    expect(rows.find(row => row.invoiceNumber === 'OTHER').status).toBeNull()
  })

  test('removeReportData deletes only the matching agreement, and rolls back with the transaction', async () => {
    await db.reportData().insert([baseRow, { ...baseRow, correlationId: '33333333-3333-3333-3333-333333333333', agreementNumber: 'AG2' }])

    const rolledBack = await db.transaction()
    await removeReportData('AG1', baseRow.frn, 'SFI', rolledBack)
    await rolledBack.rollback()
    expect(await db.reportData()).toHaveLength(2)

    const committed = await db.transaction()
    await removeReportData('AG1', baseRow.frn, 'SFI', committed)
    await committed.commit()
    const remaining = await db.reportData()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].agreementNumber).toBe('AG2')
  })

  test('generateSqlQuery builds SQL that Postgres runs with the applied filters', async () => {
    await db.reportData().insert([
      { ...baseRow, apValue: 10, daxFileName: 'f_AP_1.dat', lastUpdated: '2024-06-01T00:00:00Z' },
      { ...baseRow, correlationId: '44444444-4444-4444-4444-444444444444', invoiceNumber: 'X2', apValue: 20, daxFileName: 'f_AP_2.dat', lastUpdated: '2023-01-01T00:00:00Z' },
      { ...baseRow, correlationId: '55555555-5555-5555-5555-555555555555', invoiceNumber: 'X3', apValue: null, daxFileName: null }
    ])

    const all = await db.client.raw(generateSqlQuery())
    expect(all.rows).toHaveLength(3)

    const sql = generateSqlQuery(query => query
      .whereNotNull('apValue')
      .whereNotNull('daxFileName')
      .whereBetween('lastUpdated', [new Date('2024-01-01T00:00:00Z'), new Date('2024-12-31T00:00:00Z')]))
    const filtered = await db.client.raw(sql)
    expect(filtered.rows.map(row => row.invoiceNumber)).toEqual([baseRow.invoiceNumber])
  })
})
