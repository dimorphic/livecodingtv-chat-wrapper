// deps
import XMPP from 'node-xmpp-client';
import ltx from 'ltx';
import EventEmitter from 'events';

//
import { STANZA, CHANNEL, TRIGGERS } from './constants';
import Users from './users';

//
//  Client class
//
class Client extends EventEmitter {
    constructor(options) {
        super();

        // spread options
        const { jid, room, username, password } = options;

        // xmpp pointer
        this.client = null;

        // client config
        // user, password, jid, extra, etc
        this.config = {
            jid: jid || null,
            channel: room || null, // main channel
            username: username || null,
            password: password || null

            // showHistory: true
        };

        // channels and users lists
        this.channels = null;
        this.users = new Users();

        // go do magic
        this.init();
    }

    //
    //  init client
    //
    init() {
        if (!this.config.jid || !this.config.password) {
            throw new Error('Need jid & pass bro!');
        }

        // setup xmpp client
        this.client = new XMPP({
            jid: this.config.jid,
            password: this.config.password
        });

        // set handlers
        this.setHandlers();
    }

    //
    //  setup event handlers for client
    //
    setHandlers() {
        // online
        this.client.on('online', this.onOnline.bind(this));

        // stanza
        this.client.on('stanza', this.onStanza.bind(this));

        // error
        this.client.on('error', this.emit.bind(this));
    }

    //
    //  send helper
    //  @req: stanza
    //
    send(stanza) {
        this.client.send(stanza);
    }

    //
    // HANDLERS
    //

    //
    //  on online handler
    //
    onOnline(data) {
        // announce ourselves
        this.sendPresence();

        // send presence?
        this.emit(TRIGGERS.ONLINE, data);
    }

    //
    //  on stanza handler
    //
    onStanza(stanza) {
        let event = null;

        // stanza.name: [ message, presence ]
        // stanza.type: [ groupchat, result? ]

        // @PSEUDO
        // if eventType
        // if message
        // if presence
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
                this.onMessage(stanza);
                break;

            case STANZA.PRESENCE:
                // call handler
                this.onPresence(stanza);
                break;

            default:
                // emit forward
                this.emit(TRIGGERS.STANZA, stanza);
        }
    }

    //
    //  on presence (join/part) handler
    //
    //  @PSEUDO
    //  -> if user left -> remove from list & emit part event
    //  -> if user joined -> add to list & emit join event
    //
    onPresence(stanza) {
        const channel = this.getChannel(stanza);
        const user = this.getUser(stanza);

        // did the user join or leave ?
        const channelAction = (stanza.attrs.type === 'unavailable') ? CHANNEL.PART : CHANNEL.JOIN;

        // treat channel / user action
        switch (channelAction) {
            case CHANNEL.JOIN:
                this.users.add(user);
                break;
            case CHANNEL.PART:
                this.users.remove(user);
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

    //
    //  on message handler
    //
    //  @PSEUDO:
    //  -> ignore / replay old message(s) - check for 'delay' child?
    //  -> check if message is command and do stuffz
    //  -> emit / broadcast normal message
    //
    onMessage(stanza) {
        const fromPast = stanza.getChild('delay');
        const channel = this.getChannel(stanza);
        const msg = this.getMessage(stanza);

        // @TODO: get data from userlist store?
        const user = this.getUserName(stanza);

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
    //  on user command handler. magic
    //
    // @TODO
    onCommand(command) {
        // cmds.public = []
        // cmds.admin = []
        this.emit(TRIGGERS.COMMAND, command);
    }

    // ---------------
    // STANZA HELPERS
    // ---------------

    //
    //  create stanza xml message helper
    //
    createMessage(type, options) {
        return new ltx.Element(type, options);
    }

    // ---------------
    // MESSAGE HELPERS
    // ---------------
    // @TODO: split into module?

    //
    //  get full user (+details)
    //
    getUser(stanza) {
        const username = this.getUserName(stanza);
        const rights = this.getUserRights(stanza);

        const { affiliation = 'none', role = 'none' } = rights;

        return {
            name: username,
            // color, // @TODO
            affiliation,
            role
        };
    }

    //
    //  get message author username
    //
    getUserName(stanza) {
        const { from = '' } = stanza.attrs;
        return from.substring(from.indexOf('/') + 1, from.length);
    }

    //
    //  get user rights (admin/mod/affiliation)
    //
    getUserRights(stanza) {
        const node = stanza.getChild('x').getChild('item');
        const rights = (node.attrs) ? node.attrs : {};

        return rights;
    }

    //
    //  get channel from message
    //
    getChannel(stanza) {
        const { from = '' } = stanza.attrs;
        return from.substring(0, from.indexOf('@'));
    }

    //
    //  get message body
    //
    getMessage(stanza) {
        const node = stanza.getChild('body').children;
        return node.toString();
    }

    //
    //  send message helper
    //
    sendMessage(body, to, type) {
        const message = this.createMessage('message', {
            to,
            type
        })
        .c('body')
        .t(body);

        // send it
        this.send(message);
    }

    //
    //  send presence message helper
    //
    sendPresence(channel = this.config.channel) {
        console.log('[Client] send presence @ ', channel);

        // create new presence stanza
        const presence = this.createMessage('presence', {
            to: `${channel}/${this.config.username}`
        });

        // send it
        this.send(presence);
    }

    // ---------------
    // CHANNEL HELPERS
    // ---------------
    join(channel) {}
    part(channel) {}

    //
    //  message helper
    //
    message(body, to = this.config.channel, type = 'groupchat') {
        this.sendMessage(body, to, type);
    }
}

// expose
// export default Client;
module.exports = Client;
