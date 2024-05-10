const updateLedgerSplit = async (data) => {
  if (data.apValue && data.arValue) {
    await data.update({ ledgerSplit: 'Y' })
  } else {
    await data.update({ ledgerSplit: 'N' })
  }
}

module.exports = {
  updateLedgerSplit
}
