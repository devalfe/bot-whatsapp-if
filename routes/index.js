const express = require('express');
const webRouter = require('./web.route');
const apiRouter = require('./api.route');

const router = express.Router();

router.use('/web', webRouter);
router.post('/api', apiRouter);

module.exports = router;
