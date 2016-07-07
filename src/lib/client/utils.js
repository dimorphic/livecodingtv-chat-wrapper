// @DEBUG
import { inspect } from '../helpers';

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
    const delay = stanza.getChild('delay');
    const fromPast = (delay ? true : false);

    // console.log('delay @ ', delay);
    // console.log('frompast @ ', fromPast);

    return fromPast;
};

//
//  get full user (+details)
//
Stanza.getUser = (stanza) => {
    const username = Stanza.getUserName(stanza);
    const details = Stanza.getUserDetails(stanza);

    const { color, affiliation, premium, role, staff } = details;

    return {
        name: username,
        color,
        affiliation,
        premium,
        role,
        staff
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
/*
Stanza.getUserRights = (stanza) => {
    const node = stanza.getChild('x').getChild('item');
    const rights = (node.attrs) ? node.attrs : {};

    return rights;
};
*/

Stanza.getUserDetails = (stanza) => {
    const nodes = stanza.getChildren('x');

    const rights = nodes[0].getChild('item').attrs || {};
    const extras = nodes[1].getChild('item').attrs || {};

    const userDetails = Object.assign({}, rights, extras);
    return userDetails;
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
