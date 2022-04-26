const connectionReady = (cb = () => {}) => {
  console.log('Listo para escuchas mensajes');
  console.log('Client is ready!');
  cb();
};

const connectionLost = (cb = () => {}) => {
  console.log(
    '** Error de autentificación vuelve a generar el QRCODE (Borrar el archivo session.json) **'
  );
  cb();
};

module.exports = { connectionReady, connectionLost };
