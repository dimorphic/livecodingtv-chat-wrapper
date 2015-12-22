// deps
import XMPP from 'node-xmpp-client';
import ltx from 'ltx';
import EventEmitter from 'events';

//
import { CONNECTION } from '../constants';
import * as HANDLERS from './handlers';

//
//  Client class
//
export default class Client extends EventEmitter {
    constructor(options = {}) {
        super();

        // client default settings
        const DEFAULTS = {
            host: 'livecoding.tv',
            username: null,
            password: null,
            channel: null // auto-join if set?
        };

        // extend config with options
        this.config = Object.assign({}, DEFAULTS, options);

        if (!this.config.username || !this.config.password) {
            throw new Error('Need username & password, bro!');
        }

        // xmpp / socket pointer
        // this.online = false;
        this.connection = null;

        // channel list
        this.channels = [];

        // @DEBUG
        // this.connect();
    }

    // helpers
    getUsername() { return this.config.username; }
    getHost() { return this.config.host; }
    getChannel() { return `${this.config.username}@chat.${this.config.host}`; }
    getJid() { return `${this.config.username}@${this.config.host}`; }

    //
    //  connect / init
    //
    connect() {
        console.log(`connect @ ${this.config.host} : ${this.config.username} -> ${this.config.channel}`);

        // setup xmpp client
        this.connection = new XMPP({
            jid: this.getJid(),
            password: this.config.password
        });

        // set handlers
        this.setHandlers();
    }

    //
    //  setup / register client event handlers
    //  online, stanza, error
    //
    setHandlers() {
        // @TODO: auto-bind of handlers

        // online
        this.connection.on(CONNECTION.ONLINE, HANDLERS.onOnline.bind(this));
        this.connection.on(CONNECTION.CONNECT, HANDLERS.onConnect.bind(this));

        // stanza
        this.connection.on(CONNECTION.STANZA, HANDLERS.onStanza.bind(this));

        // error
        this.connection.on(CONNECTION.ERROR, HANDLERS.onError.bind(this));
    }

    //
    //  send stanza message helper
    //
    send(stanza) {
        this.connection.send(stanza);
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

    //
    //  send message helper
    //
    sendMessage(body, to, type) {
        const message = this.createMessage('message', {
            from: this.getJid(),
            to: `${to}@chat.${this.getHost()}`,
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
    sendPresence(channel) {
        // create new presence stanza
        const presence = this.createMessage('presence', {
            from: this.getJid(),
            to: channel
        });

        // send it
        this.send(presence);
    }

    // ---------------
    // CHANNEL HELPERS
    // ---------------
    join(channel) {
        const room = `${channel}@chat.${this.getHost()}/${this.getUsername()}`;

        // set our presence in this channel
        this.sendPresence(room);

        // add channel to list
        this.channels.push(room);
    }

    // part(channel) {}
    // alias / proxy for part()
    // leave(channel) {}

    //
    //  message helper
    //
    message(message, to = this.config.channel, type = 'groupchat') {
        console.log('here!');
        this.sendMessage(message, to, type);
    }

    // alias / proxy for message()
    say(message, to, type) { this.message(message, to, type); }
}
