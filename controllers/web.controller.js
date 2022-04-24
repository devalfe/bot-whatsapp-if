import fs from 'fs';

export default {
  qrCode: async (req, res) => {
    res.writeHead(200, { 'content-type': 'image/svg+xml' });
    fs.createReadStream(`${__dirname}/../mediaSend/qr-code.svg`).pipe(res);
  },
  sendMessage: async (req, res) => {
    const { message, number } = req.body;
    const client = req.clientWs || null;
    res.status(200).json({ status: 'Enviado!' });
  }
};
