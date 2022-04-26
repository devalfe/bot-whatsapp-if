const { connection } = require('../config/mysql');

import config from 'config-lite';

const DATABASE_NAME = config.db.database || 'db_test';

const getData = (message = '', callback) =>
  connection.query(
    `SELECT * FROM ${DATABASE_NAME}.initial WHERE keywords LIKE '%${message}%'  LIMIT 1`,
    (error, results) => {
      const [response] = results;
      const key = response?.option_key || null;
      callback(key);
    }
  );

const getReply = (option_key = '', callback) =>
  connection.query(
    `SELECT * FROM ${DATABASE_NAME}.response WHERE option_key = '${option_key}'  LIMIT 1`,
    (error, results) => {
      const [response] = results;
      console.log(response);
      const value = {
        replyMessage: response?.replyMessage || '',
        trigger: response?.trigger || '',
        media: response?.media || ''
      };
      callback(value);
    }
  );

const getMessages = number =>
  new Promise(resolve => {
    try {
      connection.query(
        `SELECT * FROM ${DATABASE_NAME}.response WHERE number = '${number}'`,
        (error, results) => {
          if (error) {
            console.log(error);
          }
          const [response] = results;
          console.log(response);
          const value = {
            replyMessage: response?.replyMessage || '',
            trigger: response?.trigger || '',
            media: response?.media || ''
          };
          resolve(value);
        }
      );
    } catch (error) {}
  });

const saveMessageMysql = (message, date, trigger, number) =>
  new Promise(resolve => {
    try {
      connection.query(
        `INSERT INTO ${DATABASE_NAME}.messages  ` +
          '( `message`, `date`, `trigger`, `number`)' +
          ` VALUES ('${message}','${date}','${trigger}', '${number}')`,
        (error, results) => {
          if (error) {
            if (error.code === 'ER_NO_SUCH_TABLE') {
              connection.query(
                `CREATE TABLE ${DATABASE_NAME}.messages ` +
                  '( `date` DATE NOT NULL , `message` VARCHAR(450) NOT NULL , `trigger` VARCHAR(450) NOT NULL , `number` VARCHAR(50) NOT NULL ) ENGINE = InnoDB',
                async () => {
                  setTimeout(
                    async () =>
                      resolve(await this.saveMessageMysql(message, date, trigger, number)),
                    150
                  );
                }
              );
            }
          }
          console.log('Saved');
          console.log(results);
          resolve(results);
        }
      );
    } catch (error) {}
  });

module.exports = { getData, getReply, saveMessageMysql };
