import express from 'express';
import controllers from '../controllers';

const router = express.Router();

router.use('/qrcode', controllers.web.qrCode);

export default router;
