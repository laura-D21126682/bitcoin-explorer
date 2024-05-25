const Header = require('../messages/header');
const Version = require('../messages/version');
const Verack = require('../messages/verack');
const Ping = require('../messages/ping');
const Pong = require('../messages/pong');

/**
 * Function creates version network message
 * - Version Network Message = serialised version + serialised header
 * - Returns byte sequence version network message
 */
const versionMessage = () => {
  const version = new Version(); // Creates new instance of Version
  const serialisedVersion = version.serialise();
  const header = new Header({ command: 'version', payload: serialisedVersion })
  const serialisedHeader = header.serialise();
  const networkMessage = Buffer.concat([serialisedHeader, serialisedVersion]);
  return networkMessage;
}

/**
 * Function creates verack network message
 * - Verack Network Message = serialised verack + serialised header
 * - Returns byte sequence verack network message
 */
const verackMessage = () => {
  const verack = new Verack(); // Creates new instance of Verack
  const serialisedVerack = verack.serialise();
  const header = new Header({ command: 'verack', payload: serialisedVerack});
  const serialisedHeader = header.serialise();
  const networkMessage = Buffer.concat([serialisedHeader, serialisedVerack]);
  return networkMessage;
}

const pingMessage = () => {
  const ping = new Ping(); // Creates new instance of Ping
  const serialisedPing = ping.serialise();
  const header = new Header({ command: 'ping', payload: serialisedPing });
  const serialisedHeader = header.serialise();
  const networkMessage = Buffer.concat([serialisedHeader, serialisedPing]);
  return networkMessage;
}

const pongMessage = () => {
  const pong = new Pong(); // Creates new instance of Pong
  const serialisedPong = pong.serialise();
  const header = new Header({ command: 'pong', payload: serialisedPong });
  const serialisedHeader = header.serialise();
  const networkMessage = Buffer.concat([serialisedHeader, serialisedPong]);
  return networkMessage;
}


module.exports = {
  versionMessage,
  verackMessage,
  pingMessage,
  pongMessage,
};