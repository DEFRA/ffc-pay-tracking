module.exports = (sequelize, DataTypes) => {
  const returns = sequelize.define('returns', {
    returnsId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    sourceSystem: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    paymentJobNumber: DataTypes.STRING,
    fesCode: DataTypes.STRING,
    traderNumber: DataTypes.STRING,
    transactionNumber: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    sbi: DataTypes.INTEGER,
    frn: DataTypes.BIGINT,
    agreementNumber: DataTypes.STRING,
    claimNumber: DataTypes.STRING,
    currency: DataTypes.STRING,
    value: DataTypes.INTEGER,
    settlementDate: DataTypes.STRING,
    paymentType: DataTypes.STRING,
    reference: DataTypes.STRING,
    bankAccount: DataTypes.STRING,
    batchNumber: DataTypes.STRING,
    settled: DataTypes.BOOLEAN,
    valueEUR: DataTypes.INTEGER,
    exchangeRate: DataTypes.STRING,
    detail: DataTypes.STRING,
    ledger: DataTypes.STRING,
    filename: DataTypes.STRING
  },
  {
    tableName: 'returns',
    freezeTableName: true,
    timestamps: false
  })
  return returns
}
