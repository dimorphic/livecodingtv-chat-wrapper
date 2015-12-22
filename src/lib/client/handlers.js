/* eslint no-use-before-define: 0*/
import { TRIGGERS, STANZA, CHANNEL } from '../constants';
import Utils from './utils';

//
//  online handler
//
export function onOnline(data) {
    // auto-join channel
    if (this.config.channel) {
        this.join(this.config.channel);
    }

    // emit online event
    this.emit(TRIGGERS.ONLINE, data);
}

//
//  connection handlers
//
export function onConnect(data) { this.emit(TRIGGERS.CONNECT, data); }
export function onDisconnect(data) { this.emit(TRIGGERS.DISCONNECT, data); }
export function onReconnect(data) { this.emit(TRIGGERS.RECONNECT, data); }
export function onError(error) {
    console.error(error); // proxy throw new?
}

//
//  stanza handler
//
export function onStanza(stanza) {
    let event = null;

    // stanza.name: [ message, presence ]
    // stanza.type: [ groupchat, result? ]

    // @PSEUDO
    // switch eventType
    // case message
    // case presence
    // else event.name

    // get stanza / event type
    // @TODO: refactor this into getStanzaType / getMessageType ?
    switch (stanza.type) {
        case STANZA.RESULT:
            event = 'result';
            break;

        default:
            event = stanza.name;
    }

    // treat event type
    switch (event) {
        case STANZA.MESSAGE:
            // call handler
            onMessage.call(this, stanza);
            break;

        case STANZA.PRESENCE:
            // call handler
            onPresence.call(this, stanza);
            break;

        default:
            // emit forward
            this.emit(TRIGGERS.STANZA, stanza);
    }
}

//
//  on message handler
//
//  @PSEUDO:
//  -> ignore / replay old message(s) - check for 'delay' child?
//  -> check if message is command and do stuffz
//  -> emit / broadcast normal message
//
export function onMessage(stanza) {
    const msg = Utils.Stanza.getMessage(stanza);
    const channel = Utils.Stanza.getChannel(stanza);
    const fromPast = Utils.Stanza.fromPast(stanza); // isOld alias ?

    // @TODO: get data from userlist store?
    const user = Utils.Stanza.getUserName(stanza);

    // this is a message from the past, a replay, deja-vu
    // ...ignore it.
    if (typeof fromPast === 'undefined') {
        // check for command argument trigger
        if (msg.indexOf('!') === 0) {
            this.onCommand(msg); // @TODO
        }
    }

    // broadcast message event
    this.emit(TRIGGERS.MESSAGE, {
        channel,
        from: user,
        message: msg
    });
}

//
//  on presence (join/part) handler
//
//  @PSEUDO
//  -> if user left -> remove from list & emit part event
//  -> if user joined -> add to list & emit join event
//
export function onPresence(stanza) {
    const channel = Utils.Stanza.getChannel(stanza);
    const user = Utils.Stanza.getUser(stanza);

    // did the user join or leave ?
    const channelAction = (stanza.attrs.type === 'unavailable') ? CHANNEL.PART : CHANNEL.JOIN;

    // treat channel / user action
    switch (channelAction) {
        case CHANNEL.JOIN:
            // this.users.add(user);
            break;
        case CHANNEL.PART:
            // this.users.remove(user);
            break;
        default:
            break;
    }

    // broadcast presence event
    this.emit(TRIGGERS.PRESENCE, {
        channel,
        type: channelAction,
        from: user
    });
}
