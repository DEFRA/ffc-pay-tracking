const db = require('../data')

const updateLedgerSplit = async (data, transaction) => {
  if (data.apValue && data.arValue) {
    await db.reportData.update({ ledgerSplit: 'Y' }, {
      where: {
        reportDataId: data.reportDataId
      },
      transaction
    })
  } else {
    await db.reportData.update({ ledgerSplit: 'N' }, {
      where: {
        reportDataId: data.reportDataId
      },
      transaction
    })
  }
}

module.exports = {
  updateLedgerSplit
}
