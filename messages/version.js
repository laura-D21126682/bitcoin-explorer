
const crypto = require('crypto');
const { intToLittleEndian, ipToBuffer } = require('../utils/helper');

class Version {
  constructor({ // default values
    version = 70015,
    services = 0,
    timestamp = Math.floor(Date.now() / 1000), // current dateTime
    receiver_services = 0,
    receiverIp = '0.0.0.0',
    receiver_port = 8333,
    sender_services = 0,
    senderIp = '0.0.0.0',
    sender_port = 8333,
    nonce = crypto.randomBytes(8), // crypto lib generates secure 8 byte random nonce
    user_agent = Buffer.from('00'), // default no agent name
    last_block = 0,
    relay = false,
  } = {}) {
    // initialises Version with default valeues if none provided
    this.version = version;
    this.services = services;
    this.timestamp = timestamp;
    this.receiver_services = receiver_services;
    this.receiverIp = ipToBuffer(receiverIp); // converts string ip address to buffer (16 bytes)
    this.receiver_port = receiver_port;
    this.sender_services = sender_services;
    this.senderIp = ipToBuffer(senderIp); // converts string ip address to buffer (16 bytes)
    this.sender_port = sender_port;
    this.nonce = nonce;
    this.user_agent = user_agent;
    this.last_block = last_block;
    this.relay = relay;
  }
}

const serialiseVersion = (msg) => {
  // serialises version fields into buffer of bytes for transmission over the Bitcoin network
  return Buffer.concat([
    intToLittleEndian(msg.version, 4), // 4 byte buffer
    intToLittleEndian(msg.services, 8), // 8 byte buffer
    intToLittleEndian(msg.timestamp, 8), // 8 byte buffer
    intToLittleEndian(msg.receiver_services, 8), // 8 byte buffer
    msg.receiverIp, // 16 byte buffer - in correct format
    intToLittleEndian(msg.receiver_port, 2), // 2 byte buffer
    intToLittleEndian(msg.sender_services, 8), // 8 byte buffer
    msg.senderIp, // 16 byte buffer - in correct format
    intToLittleEndian(msg.sender_port, 2), // 2 byte buffer
    msg.nonce, // 8 byte buffer - in correct format
    intToLittleEndian(msg.user_agent.length, 1), // converts user agent length to 1 byte buffer
    msg.user_agent, // 1 byte buffer
    intToLittleEndian(msg.last_block, 4), // 4 byte buffer
    Buffer.from([msg.relay ? 0x01: 0x00]) // converts to 1 byte buffer
  ])

}






/**references:
 * - https://github.com/jimmysong/programmingbitcoin/blob/master/ch10.asciidoc/
 * - https://en.bitcoin.it/wiki/Protocol_documentation#version
 * - https://learnmeabitcoin.com/technical/networking/#version
 * */


/**
 * Example Bitcoin Message:
 * Header:  F9BEB4D976657273696F6E0000000000550000002C2F86F3
 * Payload: 7E1101000000000000000000C515CF6100000000000000000000000000000000000000000000FFFF2E13894A208D
 * 000000000000000000000000000000000000FFFF7F000001208D00000000000000000000000000
 * 
 * Payload (version message )
 * - https://learnmeabitcoin.com/technical/networking/#version
┌───────────────────────┬─────────────────────┬────────────────────────────┬─────────┬─────────────────────────────────────────────────┐
│ Name                  │ Example Data        │ Format                     │    Size │ Example Bytes                                   │
├───────────────────────┼─────────────────────┼────────────────────────────┼─────────┼─────────────────────────────────────────────────┤
│ Protocol Version      │ 70015               │ little-endian              │       4 │ 7E 11 01 00                                     │
│ Services              │ 0                   │ bit field, little-endian   │       8 │ 00 00 00 00 00 00 00 00                         │
│ Timestamp             │ 1640961477          │ little-endian              │       8 │ C5 15 CF 61 00 00 00 00                         │
│ Receiver Services     │ 0                   │ bit field, little-endian   │       8 │ 00 00 00 00 00 00 00 00                         │
│ Receiver IP           │ 64.176.221.94       │ ipv6, big-endian           │      16 │ 00 00 00 00 00 00 00 00 00 00 FF FF 2E 13 89 4A │
│ Receiver Port         │ 8333                │ big-endian                 │       2 │ 20 8D                                           │
│ Sender Services       │ 0                   │ bit field, little-endian   │       8 │ 00 00 00 00 00 00 00 00                         │
│ Sender IP             │ 127.0.0.1           │ ipv6, big-endian           │      16 │ 00 00 00 00 00 00 00 00 00 00 FF FF 7F 00 00 01 │
│ Sender Port           │ 8333                │ big-endian                 │       2 │ 20 8D                                           │
│ Nonce                 │ 0                   │ little-endian              │       8 │ 00 00 00 00 00 00 00 00                         │
│ User Agent            │ ""                  │ compact size, ascii        │ compact │ 00                                              │
│ Last Block            │ 0                   │ little-endian              │       4 │ 00 00 00 00                                     │
└───────────────────────┴─────────────────────┴────────────────────────────┴─────────┴─────────────────────────────────────────────────┘
 */
