import express from 'express';
import webRouter from './web.route';
import apiRouter from './api.route';

const router = express.Router();

router.use('/web', webRouter);
router.use('/api', apiRouter);

export default router;
