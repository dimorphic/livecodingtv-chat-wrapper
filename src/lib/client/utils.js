//
//  Common util helpers
//
const Utils = {};

//
// Stanza util helpers
//
const Stanza = {}; // ?

//
// is stanza message from past ? (history replay¿)
//
Stanza.fromPast = (stanza) => {
    return stanza.getChild('delay');
};

//
//  get full user (+details)
//
Stanza.getUser = (stanza) => {
    const username = Stanza.getUserName(stanza);
    const rights = Stanza.getUserRights(stanza);

    const { affiliation = 'none', role = 'none' } = rights;

    return {
        name: username,
        // color, // @TODO
        affiliation,
        role
    };
};

//
//  get message author username
//
Stanza.getUserName = (stanza) => {
    const { from = '' } = stanza.attrs;
    return from.substring(from.indexOf('/') + 1, from.length);
};

//
//  get user rights (admin/mod/affiliation)
//
Stanza.getUserRights = (stanza) => {
    const node = stanza.getChild('x').getChild('item');
    const rights = (node.attrs) ? node.attrs : {};

    return rights;
};

//
//  get channel from message
//
Stanza.getChannel = (stanza) => {
    const { from = '' } = stanza.attrs;
    return from.substring(0, from.indexOf('@'));
};

//
//  get message body
//
Stanza.getMessage = (stanza) => {
    const node = stanza.getChild('body').children;
    return node.toString();
};

//
//
Utils.Stanza = Object.assign({}, Stanza);

// expose
export default Utils;
