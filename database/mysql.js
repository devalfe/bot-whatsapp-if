import mysql from 'mysql';
import config from 'config-lite';

const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.username,
  password: config.db.password,
  database: config.db.database
});

const connect = () => {
  connection.connect(err => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });
};

module.exports = {
  connect,
  connection
};
