const express = require('express');
const router = express.Router();
const { sendMessageWs } = require('../controllers/web.controller');

router.post('/send', sendMessageWs);

module.exports = router;
