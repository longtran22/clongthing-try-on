const { VNPay, ignoreLogger } = require('vnpay');

const vnpay = new VNPay({
  tmnCode: 'B98SWR0M',
  secureSecret: 'GFTQ559BMD9XM1C8M3CXGG9Q8QQH8T92',
  paymentGateway: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html/vpcpay.html', // ✅ Đúng key
  testMode: true,
  enableLog: true,
  loggerFn: ignoreLogger,
});

module.exports = vnpay;
