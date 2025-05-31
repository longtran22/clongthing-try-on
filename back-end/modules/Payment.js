const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  txnRef: { type: String, required: true },
  amount: { type: Number, required: true },
  orderInfo: { type: String },
  bankCode: { type: String },
  returnUrl: { type: String },
  locale: { type: String },
  clientIp: { type: String },
  paymentUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
