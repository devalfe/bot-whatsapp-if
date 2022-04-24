import app from './app';
import config from 'config-lite';

require('babel-core/register');

app.listen(config.port, () => {
  console.log(`server is running at port ${config.port}`);
});
