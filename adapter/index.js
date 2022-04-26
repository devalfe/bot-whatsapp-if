const { getData, getReply, saveMessageMysql } = require('./mysql');
const { saveMessageJson } = require('./jsonDb');
const { getDataIa } = require('./diaglogflow');
const stepsInitial = require('../diaglog/initial.json');
const stepsResponse = require('../diaglog/response.json');
import config from 'config-lite';

const get = message =>
  new Promise(resolve => {
    /**
     * Si no estas usando un gesto de base de datos
     */

    if (config.connection === 'none') {
      const { key } = stepsInitial.find(k => k.keywords.includes(message)) || { key: null };
      const response = key || null;
      resolve(response);
    }
    /**
     * Si usas MYSQL
     */
    if (config.connection === 'mysql') {
      getData(message, dt => {
        resolve(dt);
      });
    }
  });

const reply = step =>
  new Promise(resolve => {
    /**
     * Si no estas usando un gesto de base de datos
     */
    if (config.connection === 'none') {
      let resData = { replyMessage: '', media: null, trigger: null };
      const responseFind = stepsResponse[step] || {};
      resData = {
        ...resData,
        ...responseFind,
        replyMessage: responseFind.replyMessage.join('')
      };
      resolve(resData);
      return;
    }
    /**
     * Si usas MYSQL
     */
    if (config.connection === 'mysql') {
      let resData = { replyMessage: '', media: null, trigger: null };
      getReply(step, dt => {
        resData = { ...resData, ...dt };
        resolve(resData);
      });
    }
  });

const getIA = message =>
  new Promise(resolve => {
    /**
     * Si usas dialogflow
     */
    if (config.connection === 'dialogflow') {
      let resData = { replyMessage: '', media: null, trigger: null };
      getDataIa(message, dt => {
        resData = { ...resData, ...dt };
        resolve(resData);
      });
    }
  });

/**
 *
 * @param {*} message
 * @param {*} date
 * @param {*} trigger
 * @param {*} number
 * @returns
 */
const saveMessage = (message, trigger, number) =>
  new Promise(async resolve => {
    switch (config.connection) {
      case 'mysql':
        resolve(await saveMessageMysql(message, trigger, number));
        break;
      case 'none':
        resolve(await saveMessageJson(message, trigger, number));
        break;
      default:
        break;
    }
  });

module.exports = { get, reply, getIA, saveMessage };
