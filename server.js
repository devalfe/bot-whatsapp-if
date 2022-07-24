// import app from "./app.js";
// import config from "config-lite";
const config = require('config-lite');
const app = require('./src/app');
const server = require('http').Server(app);
// require('babel-core/register');

server.listen(process.env.PORT, () => {
  console.log(`server is running at port ${config.port}`);
});
