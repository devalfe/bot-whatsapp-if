import express from 'express';
import cors from 'cors';
import routes from './routes/web.route';

const app = express();

app
  .use(cors())
  .use(express.json())
  .use('/', routes);

export default app;
