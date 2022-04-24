require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || process.env.NODE_PORT,
  multiDevice: process.env.MULTI_DEVICE,
  defaultMessage: process.env.DEFAULT_MESSAGE,
  saveMedia: process.env.SAVE_MEDIA,
  language: process.env.LANGUAGE,
  connection: process.env.CONNECTION,
  db: {
    database: process.env.DB_DATABASE || '',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || ''
  }
};
