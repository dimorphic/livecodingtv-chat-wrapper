/* eslint no-use-before-define: 0*/
import { STANZA, CLIENT } from '../constants';
import Utils from './utils';

// @DEBUG
import { inspect } from '../helpers';

//
//  online handler
//
export function onOnline(data) {
    // auto-join channel
    if (this.config.channel) {
        this.join(this.config.channel);
    }

    // emit online event
    this.emit(CLIENT.ONLINE, data);
}

//
//  connection handlers
//
export function onConnect(data) { this.emit(CLIENT.CONNECT, data); }
export function onDisconnect(data) { this.emit(CLIENT.DISCONNECT, data); }
export function onReconnect(data) { this.emit(CLIENT.RECONNECT, data); }
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
            this.emit(CLIENT.CONNECTION_STANZA, stanza);
    }
}

//
//  on presence (join/part) handler
//
//  @PSEUDO
//  -> if user left -> remove from list & emit part event
//  -> if user joined -> add to list & emit join event
//
export function onPresence(stanza) {
    const fromPast = Utils.Stanza.fromPast(stanza);
    const channel = Utils.Stanza.getChannel(stanza);
    const user = Utils.Stanza.getUser(stanza);

    // if (fromPast) { return void 0; } // @TODO
    // console.log('stz  @ ', util.inspect(stanza, { showHidden: true, depth: null, colors: true }));
    // console.log('client fromPast @ ', util.inspect(stanza.getChild('delay'), { showHidden: true, depth: null, colors: true }));
    // console.log('stanza type @ ', stanza.attrs.type);

    // did the user join or leave ?
    const channelAction = (stanza.attrs.type === 'unavailable')
                        ? CLIENT.CHANNEL_PART : CLIENT.CHANNEL_JOIN;

    // broadcast presence event
    this.emit(CLIENT.PRESENCE, {
        channel,
        type: channelAction,
        from: user,
        fromPast
    });
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
    if (!fromPast) {
        // check for command argument trigger
        // @TODO: const COMMAND_TRIGGER = '!';
        if (msg.indexOf('!') === 0) {
            const COMMAND = {
                channel,
                from: user,
                command: msg
            };

            onCommand.call(this, COMMAND); // @TODO
        }
    }

    // broadcast message event
    this.emit(CLIENT.MESSAGE, {
        channel,
        from: user,
        message: msg
    });
}

//
//  on command message handler
//
export function onCommand(data) {
    const { channel, from, command } = data;

    // spread command and arguments
    const split = command.split(' ');
    const cmd = split[0].substring(1);
    const args = split[1] || [];

    // broadcast command event
    this.emit(CLIENT.COMMAND, {
        channel,
        from,
        command: cmd,
        args
    });
}
