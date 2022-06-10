const express = require('express');
const cors = require('cors');

const routes = require('../routes/web.route');
const fs = require('fs');

const config = require('config-lite');

const mysqlConnection = require('../database/mysql');
// const { middlewareClient } = require('./middleware/client');
const {
  generateImage,
  cleanNumber,
  checkEnvFile,
  createClient,
  isValidNumber
} = require('../services/handle');
const { connectionReady, connectionLost } = require('../services/connection');
const { saveMedia } = require('../services/save');
const { getMessages, responseMessages, bothResponse } = require('../services/flows');
const {
  sendMedia,
  sendMessage,
  lastTrigger,
  sendMessageButton,
  readChat
} = require('../services/send');
const { socketEvents } = require('../services/socket');

const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const MULTI_DEVICE = config.multiDevice || true;
const port = config.port || 8080;
const SESSION_FILE_PATH = './session.json';
const server = require('http').Server(app);

let sessionData;
let client;

app
  .use(cors())
  .use(express.json())
  .use('/', routes);

/**
 * Escuchamos cuando entre un mensaje
 */
const listenMessage = () =>
  client.on('message', async msg => {
    const { from, body, hasMedia } = msg;

    if (!isValidNumber(from)) {
      return;
    }

    // Este bug lo reporto Lucas Aldeco Brescia para evitar que se publiquen estados
    if (from === 'status@broadcast') {
      return;
    }
    let message = body.toLowerCase();
    console.log('BODY', message);
    const number = cleanNumber(from);
    await readChat(number, message);

    /**
     * Guardamos el archivo multimedia que envia
     */
    if (config.saveMedia && hasMedia) {
      const media = await msg.downloadMedia();
      saveMedia(media);
    }

    /**
     * Si estas usando dialogflow solo manejamos una funcion todo es IA
     */

    if (config.db.database === 'dialogflow') {
      if (!message.length) return;
      const response = await bothResponse(message);
      await sendMessage(client, from, response.replyMessage);
      if (response.media) {
        sendMedia(client, from, response.media);
      }
      return;
    }

    /**
     * Ver si viene de un paso anterior
     * Aqui podemos ir agregando más pasos
     * a tu gusto!
     */

    const lastStep = (await lastTrigger(from)) || null;
    if (lastStep) {
      const response = await responseMessages(lastStep);
      await sendMessage(client, from, response.replyMessage);
    }

    /**
     * Respondemos al primero paso si encuentra palabras clave
     */
    const step = await getMessages(message);

    if (step) {
      const response = await responseMessages(step);

      /**
       * Si quieres enviar botones
       */

      await sendMessage(client, from, response.replyMessage, response.trigger);

      if (response.hasOwnProperty('actions')) {
        const { actions } = response;
        await sendMessageButton(client, from, null, actions);
        return;
      }

      if (!response.delay && response.media) {
        sendMedia(client, from, response.media);
      }
      if (response.delay && response.media) {
        setTimeout(() => {
          sendMedia(client, from, response.media);
        }, response.delay);
      }
      return;
    }

    //Si quieres tener un mensaje por defecto
    if (config.defaultMessage === 'true') {
      const response = await responseMessages('DEFAULT');
      await sendMessage(client, from, response.replyMessage, response.trigger);

      /**
       * Si quieres enviar botones
       */
      if (response.hasOwnProperty('actions')) {
        const { actions } = response;
        await sendMessageButton(client, from, null, actions);
      }
    }
  });

const withSession = () => {
  console.log(`Validando session con Whatsapp...`);
  sessionData = require(SESSION_FILE_PATH);
  client = new Client(createClient(sessionData, true));

  client.on('ready', () => {
    connectionReady();
    listenMessage();
    // loadRoutes(client);
    socketEvents.sendStatus();
  });

  client.on('auth_failure', () => connectionLost());

  client
    .initialize()
    .then(r => {
      console.log('Cliente inicializado withSession');
    })
    .catch(e => {
      console.log('Error al inicializar cliente', e);
    });
};

/**
 * Generamos un QRCODE para iniciar sesion
 */
const withOutSession = () => {
  console.log('No tenemos session guardada');
  console.log(
    ['🙌 Ten paciencia se esta generando el QR CODE', '________________________'].join('\n')
  );

  client = new Client(createClient());

  client.on('qr', qr =>
    generateImage(qr, () => {
      qrcode.generate(qr, { small: true });
      //console.log(`Ver QR http://localhost:${port}/qrcode`);
      socketEvents.sendQR(qr);
    })
  );

  client.on('ready', a => {
    connectionReady();
    listenMessage();
    // socketEvents.sendStatus(client)
  });

  client.on('auth_failure', e => {
    // console.log(e)
    connectionLost();
  });

  client.on('authenticated', session => {
    sessionData = session;
    if (sessionData) {
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
        if (err) {
          console.log(`Ocurrió un error con el archivo: `, err);
        }
      });
    }
  });

  client
    .initialize()
    .then(r => {
      console.log('Cliente inicializado');
    })
    .catch(e => {
      console.log('Error al inicializar el cliente', e);
    });
};

fs.existsSync(SESSION_FILE_PATH) && MULTI_DEVICE === 'false' ? withSession() : withOutSession();

if (process.env.DATABASE === 'mysql') {
  mysqlConnection.connect();
}

server.listen(port, () => {
  console.log(`El server esta listo por el puerto ${port}`);
});

checkEnvFile();
