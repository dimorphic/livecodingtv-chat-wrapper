//
//  Client triggered event types
//  @TODO: customize more!
//
exports.TRIGGERS = {
    ONLINE: 'online',
    CONNECT: 'connect',
    // DISCONNECT: 'disconnect',
    // RECONNECT: 'reconnect',

    PRESENCE: 'presence',
    STANZA: 'stanza',

    MESSAGE: 'message',
    COMMAND: 'command'
};

//
//  Channel event types
//
exports.CHANNEL = {
    JOIN: 'join',
    PART: 'part'
};

//
//  Connection / socket events
//
exports.CONNECTION = {
    ONLINE: 'online',
    CONNECT: 'connect', // ? double check these
    // DISCONNECT: 'disconnect', // ?
    // RECONNECT: 'reconnect', // ?
    ERROR: 'error',
    STANZA: 'stanza'
};

//
//  Stanza message types
//
exports.STANZA = {
    MESSAGE: 'message',
    PRESENCE: 'presence',
    RESULT: 'result'
};
