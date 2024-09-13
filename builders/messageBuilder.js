
const Header = require('../messages/header');
const Version = require('../messages/version');
const Verack = require('../messages/verack');
const Ping = require('../messages/ping');
const Pong = require('../messages/pong');
const GetData = require('../messages/getData');
const GetBlocks = require('../messages/getBlocks');


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

const getDataMessage = (invItems) => {
  const getData = new GetData(); // Creates new instance of GetData
  getData.loadInvData(invItems); // Loads inv data into GetData Message
  const serialisedGetData = getData.serialise(); 
  const header = new Header({ command: 'getdata', payload: serialisedGetData });
  const serialisedHeader = header.serialise();
  const networkMessage = Buffer.concat([serialisedHeader, serialisedGetData]);
  return networkMessage;
}

const getBlocksMessage = () => {
    const getBlocks = new GetBlocks({ 
      version: 70015,
      blockLocatorHashes: [
        '09f8fd6ba6f0b6d5c207e8fcbcf50f46876a5deffbac4701d7d0f13f00000000', 
        '161126f0d39ec082e51bbd29a1dfb40b416b445ac8e493f88ce9938600000000', 
        '378a6f6593e2f0251132d96616e837eb6999bca963f6675a0c7af18000000000',
        '161126f0d39ec082e51bbd29a1dfb40b416b445ac8e493f88ce9938600000000'],
      hashStop: '9a22db7fd25e719abf9e8ccf869fbbc1e22fa71822a37efae054c17b00000000' }); 
    const serialisedGetBlocks = getBlocks.serialise();
    const header = new Header({ command: 'getblocks', payload: serialisedGetBlocks });
    const serialisedHeader = header.serialise();
    const networkMessage = Buffer.concat([serialisedHeader, serialisedGetBlocks]);
    return networkMessage;
  }



module.exports = {
  versionMessage,
  verackMessage,
  getDataMessage,
  getBlocksMessage,
  pingMessage,
  pongMessage,
};