const express = require('express');

const {createOrder, capturePaymentAndFinalizeOrder} = require('../../conrollers/student-controller/order-conroller')

const router = express.router();

router.post('/create', createOrder);
router.post('/capture', capturePaymentAndFinalizeOrder);

module.exports = router;