// routes/paymentRoutes.js
const express = require('express');
const { createVNPayPayment, getAllPayments } = require('../controllers/paymentController.js');

const router = express.Router();

router.post('/vnpay', createVNPayPayment);
router.get('/getAllvnpay',  getAllPayments);

module.exports = router; // ✅ sửa lại chỗ này
