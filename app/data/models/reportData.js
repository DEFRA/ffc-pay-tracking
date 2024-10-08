module.exports = (sequelize, DataTypes) => {
  return sequelize.define('reportData', {
    reportDataId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    correlationId: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    claimNumber: DataTypes.STRING,
    agreementNumber: DataTypes.STRING,
    marketingYear: DataTypes.INTEGER,
    originalInvoiceNumber: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    currency: DataTypes.STRING,
    paymentRequestNumber: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    batch: DataTypes.STRING,
    sourceSystem: DataTypes.STRING,
    batchExportDate: DataTypes.DATE,
    status: DataTypes.STRING,
    lastUpdated: DataTypes.DATE,
    revenueOrCapital: DataTypes.STRING,
    year: DataTypes.INTEGER,
    routedToRequestEditor: DataTypes.STRING,
    deltaAmount: DataTypes.INTEGER,
    apValue: DataTypes.INTEGER,
    arValue: DataTypes.INTEGER,
    debtType: DataTypes.STRING,
    daxFileName: DataTypes.STRING,
    daxImported: DataTypes.STRING,
    settledValue: DataTypes.INTEGER,
    phError: DataTypes.STRING,
    daxError: DataTypes.STRING,
    receivedInRequestEditor: DataTypes.DATE,
    enriched: DataTypes.STRING,
    ledgerSplit: DataTypes.STRING,
    releasedFromRequestEditor: DataTypes.DATE,
    daxPaymentRequestNumber: DataTypes.INTEGER,
    daxValue: DataTypes.INTEGER,
    overallStatus: DataTypes.STRING,
    crossBorderFlag: DataTypes.STRING,
    valueStillToProcess: DataTypes.INTEGER,
    prStillToProcess: DataTypes.INTEGER,
    fdmrSchemeCode: DataTypes.STRING
  },
  {
    tableName: 'reportData',
    freezeTableName: true,
    timestamps: false
  })
}
