const { VNPay, ignoreLogger } = require('vnpay');

const vnpay = new VNPay({
  tmnCode: 'BZQK8RQE',
  secureSecret: 'I7T98ZY7NGS0FU5N4ET36LGA9Z3V2UUD',
  vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  testMode: true,
  enableLog: true,
  loggerFn: ignoreLogger,
});

module.exports = vnpay;
