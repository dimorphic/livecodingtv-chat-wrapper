// customize at will

//
//  CLIENT event types
//
const CLIENT = {
    CONNECTION_ONLINE: 'online',
    CONNECTION_CONNECT: 'connect',
    // CONNECTION_DISCONNECT: 'disconnect',
    // CONNECTION_RECONNECT: 'reconnect',
    CONNECTION_ERROR: 'error',
    CONNECTION_STANZA: 'stanza',

    ONLINE: 'online',
    CONNECT: 'connect',

    PRESENCE: 'presence',
    CHANNEL_JOIN: 'join',
    CHANNEL_PART: 'part',

    MESSAGE: 'message',
    COMMAND: 'command'
};

//
//  BOT event types
//
const BOT = {
    ONLINE: 'bot.online',
    ERROR: 'bot.error',

    PRESENCE: 'bot.presence',
    JOIN: 'bot.join', // for commodity
    PART: 'bot.part', // for commodity

    MESSAGE: 'bot.mesage',
    COMMAND: 'bot.command'
};

//  ########################################
//  No need to touch below most of the time.
//  ########################################

//
//  STANZA message types
//
const STANZA = {
    MESSAGE: 'message',
    PRESENCE: 'presence',
    RESULT: 'result'
};

// expose
module.exports = {
    CLIENT,
    BOT,
    STANZA
};
