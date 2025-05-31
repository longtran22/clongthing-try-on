// routes/paymentRoutes.js
const express = require('express');
const { createVNPayPayment } = require('../controllers/paymentController.js');

const router = express.Router();

router.post('/vnpay', createVNPayPayment);

module.exports = router; // ✅ sửa lại chỗ này
