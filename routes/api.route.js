import express from 'express';
import controllers from '../controllers';

const router = express.Router();

router.use('/send', controllers.web.sendMessage);

export default router;
