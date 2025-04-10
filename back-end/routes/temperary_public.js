const express = require('express');
const public = require('../controllers/public'); // Import controller

const router = express.Router();
router.get('/success', public.success);
router.get('/', public.mn);



module.exports = router;