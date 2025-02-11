const db = require('../data')
const { getOverallStatus } = require('../data-generation')

const updateReportData = async (updateData, reportDataId) => {
  await db.reportData.update(updateData, { where: { reportDataId } })
}

const computeUpdateData = (relatedPaymentRequest, currentPaymentRequest, value, paymentRequestNumber) => {
  const updateData = {}
  updateData.daxValue = relatedPaymentRequest.daxValue + currentPaymentRequest.daxValue
  updateData.daxPaymentRequestNumber = Math.max(relatedPaymentRequest.daxPaymentRequestNumber, currentPaymentRequest.daxPaymentRequestNumber)
  updateData.overallStatus = getOverallStatus(
    value,
    updateData.daxValue,
    paymentRequestNumber,
    updateData.daxPaymentRequestNumber
  )
  updateData.valueStillToProcess = value - updateData.daxValue
  return updateData
}

const handleSamePaymentRequestNumber = async (relatedPaymentRequest, currentPaymentRequest) => {
  if (relatedPaymentRequest.invoiceNumber !== currentPaymentRequest.invoiceNumber) {
    const updateData = computeUpdateData(
      relatedPaymentRequest,
      currentPaymentRequest,
      relatedPaymentRequest.value,
      relatedPaymentRequest.paymentRequestNumber
    )
    if (relatedPaymentRequest.ledger !== currentPaymentRequest.ledger) {
      updateData.ledgerSplit = 'Y'
    }
    updateData.prStillToProcess = relatedPaymentRequest.paymentRequestNumber - updateData.daxPaymentRequestNumber
    await updateReportData(updateData, relatedPaymentRequest.reportDataId)
    await updateReportData(updateData, currentPaymentRequest.reportDataId)
  } else {
    await handleInvoiceNumberMatch(relatedPaymentRequest, currentPaymentRequest)
  }
}

const handleInvoiceNumberMatch = async (relatedPaymentRequest, currentPaymentRequest) => {
  const updateData = {}
  for (const key in relatedPaymentRequest) {
    if (relatedPaymentRequest[key] === null && currentPaymentRequest[key] !== null) {
      updateData[key] = currentPaymentRequest[key]
    }
  }
  if (Object.keys(updateData).length > 0) {
    await db.reportData.update(updateData, { where: { reportDataId: relatedPaymentRequest.reportDataId } })
  }
  await db.reportData.destroy({ where: { reportDataId: currentPaymentRequest.reportDataId } })
}

const updatePaymentRequestData = async (relatedPaymentRequest, currentPaymentRequest) => {
  if (relatedPaymentRequest.paymentRequestNumber > currentPaymentRequest.paymentRequestNumber) {
    const updateData = computeUpdateData(
      relatedPaymentRequest,
      currentPaymentRequest,
      relatedPaymentRequest.value,
      relatedPaymentRequest.paymentRequestNumber
    )
    if (currentPaymentRequest.paymentRequestNumber + 1 === relatedPaymentRequest.paymentRequestNumber) {
      updateData.deltaAmount = relatedPaymentRequest.value - currentPaymentRequest.value
    }
    await updateReportData(updateData, relatedPaymentRequest.reportDataId)
  } else if (relatedPaymentRequest.paymentRequestNumber === currentPaymentRequest.paymentRequestNumber) {
    await handleSamePaymentRequestNumber(relatedPaymentRequest, currentPaymentRequest)
  } else {
    const updateData = computeUpdateData(
      relatedPaymentRequest,
      currentPaymentRequest,
      currentPaymentRequest.value,
      currentPaymentRequest.paymentRequestNumber
    )
    if (relatedPaymentRequest.paymentRequestNumber + 1 === currentPaymentRequest.paymentRequestNumber) {
      updateData.deltaAmount = currentPaymentRequest.value - relatedPaymentRequest.value
    }
    await updateReportData(updateData, currentPaymentRequest.reportDataId)
  }
}

module.exports = {
  updatePaymentRequestData
}
