//
//  Client triggered event types
//  @TODO: customize more!
//
exports.TRIGGERS = {
    ONLINE: 'online',
    PRESENCE: 'presence',
    MESSAGE: 'message',
    COMMAND: 'command',
    STANZA: 'stanza'
};

//
//  Channel event types
//
exports.CHANNEL = {
    JOIN: 'join',
    PART: 'part'
};

//
//  Stanza message types
//
exports.STANZA = {
    MESSAGE: 'message',
    PRESENCE: 'presence',
    RESULT: 'result'
};
