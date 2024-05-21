const Header = require('../messages/header');
const Version = require('../messages/version');
const Verack = require('../messages/verack');

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


module.exports = {
  versionMessage,
  verackMessage,
};