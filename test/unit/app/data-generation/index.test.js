const index = require('../../../../app/data-generation/index')
const { getAPAmount } = require('../../../../app/data-generation/get-ap-amount')
const { getARAmount } = require('../../../../app/data-generation/get-ar-amount')
const { getBatch } = require('../../../../app/data-generation/get-batch')
const { getBatchExportDate } = require('../../../../app/data-generation/get-batch-export-date')
const { getDAXError } = require('../../../../app/data-generation/get-dax-error')
const { getDebtType } = require('../../../../app/data-generation/get-debt-type')
const { getDeltaAmount } = require('../../../../app/data-generation/get-delta-amount')
const { getFileName } = require('../../../../app/data-generation/get-file-name')
const { getOriginalInvoiceNumber } = require('../../../../app/data-generation/get-original-invoice-number')
const { getPHError } = require('../../../../app/data-generation/get-ph-error')
const { getRevenue } = require('../../../../app/data-generation/get-revenue')
const { getSettledValue } = require('../../../../app/data-generation/get-settled-value')
const { getStatus } = require('../../../../app/data-generation/get-status')
const { getValue } = require('../../../../app/data-generation/get-value')
const { getWarningStatus } = require('../../../../app/data-generation/get-warning-status')
const { getYear } = require('../../../../app/data-generation/get-year')
const { isImported } = require('../../../../app/data-generation/is-imported')
const { routedToRequestEditor } = require('../../../../app/data-generation/routed-to-request-editor')

test('exports', () => {
  expect(index).toEqual({
    getAPAmount,
    getARAmount,
    getBatch,
    getBatchExportDate,
    getDAXError,
    getDebtType,
    getDeltaAmount,
    getFileName,
    getOriginalInvoiceNumber,
    getPHError,
    getRevenue,
    getSettledValue,
    getStatus,
    getValue,
    getWarningStatus,
    getYear,
    isImported,
    routedToRequestEditor
  })
})
