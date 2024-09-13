const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { logger } = require('./utils/logHandler');
const btcRouter = require('./routes/btcRoutes');
const { websocketSetup } = require('./websocket');
const { errorHandler, unknownEndpoint } = require('./utils/middleware');

const app = express();
const server = http.createServer(app); // Pass express app to http server

// Middleware
app.use(express.json())
app.use(cors());
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express serves frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// test request
app.get('/', (_req, res) => {
  // res.write(`<h1>bitcoin-api</br>port: 3000</h1>`);
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Routes
app.use('/btc-api', btcRouter);
app.use(unknownEndpoint);
app.use(errorHandler);


// Import .env vars
const PORT = process.env.PORT || 3000;
const BTC_PORT = process.env.BTC_PORT;
const DNS_SEED = process.env.DNS_SEED;
const BTC_ADDRESSES = process.env.BTC_ADDRESSES.split(',').map(address => address);

// Websocket setup 
websocketSetup(server, BTC_PORT, BTC_ADDRESSES); // pass BTC_ADDRESS/ES OR DNS_SEED for loading connection (Set up in .env)


// Start express server
server.listen(PORT, () => {
  logger('info', 'Server listening on port 3000');
});
