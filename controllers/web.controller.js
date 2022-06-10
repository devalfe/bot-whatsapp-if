const fs = require('fs');
const sendMessage = require('../services/send');

const qrCode = (req, res) => {
  res.writeHead(200, { 'content-type': 'image/svg+xml' });
  fs.createReadStream(`${__dirname}/../mediaSend/qr-code.svg`).pipe(res);
};
const sendMessageWs = (req, res) => {
  const { message, number } = req.body;
  const client = req.clientWs || null;
  sendMessage(client, number, message);
  res.status(200).json({ status: 'Enviado!' });
};
module.exports = { qrCode, sendMessageWs };
