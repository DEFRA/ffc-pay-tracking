const getOverallStatus = (value, daxValue, prn, daxPRN) => {
  if (value === daxValue && prn === daxPRN) {
    return 'Complete'
  }
  return 'Incomplete'
}

module.exports = {
  getOverallStatus
}
