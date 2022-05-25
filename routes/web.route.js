const express = require('express');
const router = express.Router();
const { qrCode } = require('../controllers/web.controller');

router.use('/qrcode', qrCode);

module.exports = router;
