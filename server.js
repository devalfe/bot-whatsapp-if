// import app from "./app.js";
// import config from "config-lite";
const config = require('config-lite');
const app = require('./app');
const server = require('http').Server(app);
// require('babel-core/register');

server.listen(config.port, () => {
  console.log(`server is running at port ${config.port}`);
});
