const db = require('../data')
const { getOverallStatus } = require('../data-generation')

const updatePaymentRequestData = async (paymentRequest, data) => {
  const updateData = {}
  if (paymentRequest.paymentRequestNumber > data.paymentRequestNumber) {
    updateData.daxValue = paymentRequest.daxValue + data.daxValue
    updateData.daxPaymentRequestNumber = Math.max(paymentRequest.daxPaymentRequestNumber, data.daxPaymentRequestNumber)
    updateData.overallStatus = getOverallStatus(paymentRequest.value, updateData.daxValue, paymentRequest.paymentRequestNumber, updateData.daxPaymentRequestNumber)
    updateData.valueStillToProcess = paymentRequest.value - updateData.daxValue
    await db.reportData.update(
      updateData,
      { where: { reportDataId: paymentRequest.reportDataId } })
    await db.reportData.create({ ...data })
  } else if (paymentRequest.paymentRequestNumber === data.paymentRequestNumber && paymentRequest.invoiceNumber !== data.invoiceNumber) {
    updateData.daxValue = paymentRequest.daxValue + data.daxValue
    updateData.deltaAmount = paymentRequest.deltaAmount + data.deltaAmount
    updateData.daxPaymentRequestNumber = Math.max(paymentRequest.daxPaymentRequestNumber, data.daxPaymentRequestNumber)
    updateData.overallStatus = getOverallStatus(paymentRequest.value, updateData.daxValue, paymentRequest.paymentRequestNumber, updateData.daxPaymentRequestNumber)
    updateData.valueStillToProcess = paymentRequest.value - updateData.daxValue
    updateData.prStillToProcess = paymentRequest.paymentRequestNumber - updateData.daxPaymentRequestNumber
    await db.reportData.update(updateData, { where: { reportDataId: paymentRequest.reportDataId } })
    await db.reportData.create({ ...data })
  } else if (paymentRequest.paymentRequestNumber === data.paymentRequestNumber) {
    for (const key in data) {
      if (paymentRequest[key] === null && data[key] !== null) {
        updateData[key] = data[key]
      }
    }
    if (Object.keys(updateData).length > 0) {
      await db.reportData.update(updateData, { where: { reportDataId: paymentRequest.reportDataId } })
    }
  } else {
    data.daxValue = paymentRequest.daxValue + data.daxValue
    data.daxPaymentRequestNumber = Math.max(paymentRequest.daxPaymentRequestNumber, data.daxPaymentRequestNumber)
    data.overallStatus = getOverallStatus(paymentRequest.value, data.daxValue, paymentRequest.paymentRequestNumber, data.daxPaymentRequestNumber)
    data.valueStillToProcess = paymentRequest.value - data.daxValue
    await db.reportData.create({ ...data })
  }
}

module.exports = {
  updatePaymentRequestData
}