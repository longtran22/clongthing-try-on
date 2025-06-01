const vnpay = require('../modules/config/vnpay.js'); // module cấu hình VNPay
const Payment = require('../modules/Payment.js');    // model Payment (MongoDB)

// const getAllPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find().sort({ createdAt: -1 }); // sắp xếp theo thời gian mới nhất
//     res.json(payments);
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách thanh toán:', error);
//     res.status(500).json({ error: 'Lỗi server khi lấy danh sách thanh toán' });
//   }
// };
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    // Tính tổng amount
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    res.json({
      payments,
      totalAmount
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thanh toán:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách thanh toán' });
  }
};


const createVNPayPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body; // lấy từ client gửi lên
    if (!amount || !orderId) {
      return res.status(400).json({ error: "Thiếu amount hoặc orderId" });
    }
    let safeAmount = Number(amount);
      if (isNaN(safeAmount)) safeAmount = 10000000;

  

    // const returnUrl = 'http://localhost:3000/payment-success'; // frontend URL trả về
    const returnUrl = 'http://localhost:3000/shop/import';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Tạo URL thanh toán VNPay
    const url = await vnpay.buildPaymentUrl({
      // amount: safeAmount, // đây phải là số nguyên (amount * 100) kiểu number, ví dụ 11000000
      // bankCode: '',
      // orderId,
      // orderInfo: `Thanh toán đơn hàng ${orderId}`,
      // returnUrl,
      // locale: 'vn',
      // txnRef: orderId,
      // clientIp,
      // vnp_Amount: safeAmount,
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: 'BZQK8RQE',
      vnp_Amount: safeAmount ,       // ✅ Sửa ở đây
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: clientIp === '::1' ? '127.0.0.1' : clientIp,
      vnp_CreateDate: new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14), // tự động tạo thời gian hiện tại
    });

    // const VnpayResponseurl = await vnpay.buildPaymentUrl({
  
 

    //   vnp_Version: '2.1.0',
    //   vnp_Command: 'pay',
      
    //   vnp_Amount: safeAmount,       // số tiền * 100
    //   vnp_CurrCode: 'VND',
    //   vnp_TxnRef: orderId,
    //   vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
    //   vnp_OrderType: 'other',
    //   vnp_Locale: 'vn',             // hoặc 'en' nếu là tiếng Anh
    //   vnp_ReturnUrl: 'http://localhost:3000/payment-success',
    //   vnp_IpAddr: '127.0.0.1',      // IP client (đừng để "::1" nếu không xử lý IPv6)
    //   vnp_CreateDate: '20250529051704',
    //   vnp_BankCode: ''              // bỏ trống nếu để user chọn ngân hàng ở giao diện VNPay


    // });
    
    // Lưu thông tin thanh toán vào database
    await Payment.create({
      orderId,
      txnRef: orderId,
      amount: Number(amount) / 100, // lưu lại amount VND (chưa nhân 100)
      orderInfo: `Thanh toán đơn hàng ${orderId}`,
      bankCode: '',
      returnUrl,
      locale: 'vn',
      clientIp,
      paymentUrl: url,
    });

    res.json({ paymentUrl: url });
  } catch (error) {
    console.error('Lỗi tạo thanh toán VNPay:', error);
    res.status(500).json({ error: 'Lỗi tạo thanh toán VNPay' });
  }
};

module.exports = { 
  createVNPayPayment,
   getAllPayments
};
