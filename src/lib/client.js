// deps
import XMPP from 'node-xmpp-client';
import ltx from 'ltx';
import EventEmitter from 'events';

//
//  Client class
//
class Client extends EventEmitter {
    constructor(options) {
        super();

        // spread options
        const { jid, room, username, password } = options;

        // channels and users lists
        this.channels = [];
        this.users = [];

        // client config
        // user, password, jid, extra, etc
        this.config = {
            jid: jid || null,
            channel: room || null, // main channel
            username: username || null,
            password: password || null,

            showHistory: true
        };

        // xmpp pointer
        this.client = null;

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
        this.client.on('online', (data) => {
            this.onOnline(data);

            // send presence?
            this.emit('online', data);
        });

        // stanza
        this.client.on('stanza', (stanza) => {
            this.onStanza(stanza);

            // stanza.type
            this.emit('stanza', stanza);
        });

        // error
        this.client.on('error', (error) => {
            this.emit('error', error);
        });
    }

    //
    //  send helper
    //  @req: stanza
    //
    send(stanza) { this.client.send(stanza); }

    // HANDLERS

    //
    //  on online handler
    //
    onOnline(data) {
        // announce ourselves
        this.sendPresence();
    }

    //
    //  on stanza handler
    //
    onStanza(stanza) {
        let event = null;

        // stanza.name: [ message, presence ]
        // stanza.type: [ groupchat, result? ]

        // get stanza / event type
        // @TODO: refactor this into getStanzaType / getMessageType ?
        switch (stanza.type) {
            case 'result':
                event = 'result';
                break;

            default:
                event = stanza.name;
        }

        // treat event type
        switch (event) {
            case 'message':
                // call handler
                this.onMessage(stanza);
                break;

            case 'presence':
                // call handler
                this.onPresence(stanza);
                break;

            default:
                // emit forward
                this.emit(event, stanza);
        }

        // @PSEUDO
        // if eventType

        // if message
        //  -> ignore / replay old message(s) - check for 'delay' child?
        //  -> check if message is command and do stuffz
        //  -> emit / broadcast normal message

        // if presence
        //  -> if user left -> remove from list & emit part event
        //  -> if user joined -> add to list & emit join event
    }

    //
    //  on presence (join/part) handler
    //
    onPresence(stanza) {
        const channel = this.getChannel(stanza);
        const user = this.getAuthor(stanza);
        const userDetails = this.getAuthorDetails(stanza);

        // @TODO: add / update userlist
        // if userDetails -> update(channels[].users[user])

        // unavailable
        // console.log('stanza @ ', stanza.attrs.type);

        // broadcast presence event
        this.emit('presence', {
            channel: channel,
            from: {
                user: user,
                details: userDetails
            }
            // type?
        });
    }

    //
    //  on message handler
    //
    onMessage(stanza) {
        const user = this.getAuthor(stanza);
        const msg = this.getMessage(stanza);
        const fromPast = stanza.getChild('delay');

        // this is a message from the past, a replay, deja-vu
        // ignore it,
        if (typeof fromPast === 'undefined') {
            // check for command argument trigger
            if (msg.indexOf('!') == 0) {
                this.onCommand(msg); // @TODO
            }
        }

        // broadcast message event
        this.emit('message', {
            from: user,
            message: msg
        });
    }

    //
    //  on user command handler. magic
    //
    // @TODO
    onCommand(command) {
        this.emit('command', command);
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

    //
    //  get message author
    //
    getAuthor(stanza) {
        const { from = '' } = stanza.attrs;
        return from.substring(from.indexOf('/') + 1, from.length);
    }

    getAuthorDetails(stanza) {
        const affiliation = stanza.getChild('x').getChild('item').attrs;
        return affiliation;
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
            to: to,
            type: type
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
