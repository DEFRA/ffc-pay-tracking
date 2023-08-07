module.exports = (sequelize, DataTypes) => {
  const returnRequest = sequelize.define('returnRequest', {
    returnRequestId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    sourceSystem: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    paymentJobNumber: DataTypes.STRING,
    fescode: DataTypes.STRING,
    traderNumber: DataTypes.STRING,
    transactionNumber: DataTypes.STRING,
    // deliveryBody: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    sbi: DataTypes.INTEGER,
    frn: DataTypes.BIGINT,
    // vendor: DataTypes.STRING,
    // marketingYear: DataTypes.INTEGER,
    agreementNumber: DataTypes.STRING,
    claimNumber: DataTypes.STRING,
    // contractNumber: DataTypes.STRING,
    // paymentRequestNumber: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    // schedule: DataTypes.STRING,
    // dueDate: DataTypes.STRING,
    // debtType: DataTypes.STRING,
    // recoveryDate: DataTypes.STRING,
    value: DataTypes.INTEGER,
    settlementDate: DataTypes.STRING,
    paymentType: DataTypes.STRING,
    // received: DataTypes.DATE,
    reference: DataTypes.STRING,
    bankAccount: DataTypes.STRING,
    batchNumber: DataTypes.STRING,
    settled: DataTypes.BOOLEAN,
    valueEUR: DataTypes.INTEGER,
    exchangeRate: DataTypes.STRING,
    detail: DataTypes.STRING,
    ledger: DataTypes.STRING,
    filename: DataTypes.STRING
    // correlationId: DataTypes.UUID,
    // pillar: DataTypes.STRING,
    // eventDate: DataTypes.STRING,
    // claimDate: DataTypes.STRING
  },
  {
    tableName: 'returnRequests',
    freezeTableName: true,
    timestamps: false
  })
  /*
  returnRequest.associate = (models) => {
    returnRequest.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
    returnRequest.hasMany(models.invoiceLine, {
      foreignKey: 'paymentRequestId',
      as: 'invoiceLines'
    })
    returnRequest.hasMany(models.schedule, {
      foreignKey: 'paymentRequestId',
      as: 'schedules'
    })
    returnRequest.hasMany(models.completedPaymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'completedPaymentRequests'
    })
  }
  */
  return returnRequest
}
