// deps
import Client from '../client';
import EventEmitter from 'events';

// models
import Users from './models/users'; // move this?
import Command from './models/command';

// events and handlers
import { CLIENT, BOT } from '../constants';
import * as HANDLERS from './handlers';

// @debug
import { inspect } from '../helpers';

//
//  Bot class
//
export default class Bot extends EventEmitter {
    constructor(options = {}) {
        super();

        // spread config, client and users list
        const {
            config = {},
            commands = {},
            debug = false,
            client = null,
            users = new Users()
        } = options;

        // check for username and password
        if (!config.username || !config.password) {
            throw new Error('Bot needs username & password, bro!');
        }

        this.config = config;
        this.channel = config.channel || null; // home channel ?

        this.debug = debug;
        this.client = client;
        // this.online = false;
        this.commands = {};

        // channel and user list
        this.channels = [];
        this.users = users;

        // magic
        this.init(commands);
    }

    init(commands) {
        if (!this.client) {
            // boot new client
            this.client = new Client(this.config);
        }

        // setup / register bot custom handlers
        this.setHandlers();
        this.commands = this.registerCommands(commands);

        // connect
        this.connect();
    }

    connect() {
        this.client.connect();
    }

    setHandlers() {
        // online, connect, disconnect, error
        // stanza?, presence, message
        this.client.on(CLIENT.ONLINE, HANDLERS.onOnline.bind(this));
        this.client.on(CLIENT.PRESENCE, HANDLERS.onPresence.bind(this));

        this.client.on(CLIENT.MESSAGE, HANDLERS.onMessage.bind(this));
        this.client.on(CLIENT.COMMAND, HANDLERS.onCommand.bind(this));
    }

    // inherited from EventEmitter
    // @TODO: replace with proxies to this.client EventEmitter?
    // on() {}
    // emit() {}

    registerEvent(cmd) {
        // triggers: [ join, part, message ]
        const trigger = cmd.trigger.toUpperCase();
        const event = BOT[trigger];

        if (event) {
            this.on(event, (data) => {
                cmd.handler(this, data);
            });
        }
    }

    registerCommands(list = {}) {
        // console.log('cmd list @ ', inspect(list));

        // spread commands lists
        const { admin, common } = list;

        let COMMANDS = {};
        const COMMANDS_COMMON = {};
        const COMMANDS_ADMIN = {};

        // public / common commands
        Object.keys(common).forEach((trigger) => {
            const cmd = common[trigger];

            // console.log('parsing @ ', trigger, cmd);

            // command is an event
            //  ... register and handle
            if (cmd.type === 'event') {
                this.registerEvent(cmd);
                return;
            }

            // console.log('registering @ ', cmd.trigger, new Command(cmd));

            // register common command
            COMMANDS_COMMON[cmd.trigger] = new Command(cmd);
        });

        // admin commands
        Object.keys(admin).forEach((trigger) => {
            COMMANDS_ADMIN[trigger] = new Command(admin[trigger]);
        });

        // merge all commands
        COMMANDS = Object.assign({}, COMMANDS_COMMON, COMMANDS_ADMIN);

        return COMMANDS;
    }

    say(message) { this.client.say(message); }

    getUser(user) {
        return this.users.getUser(user);
    }

    getUsers() {
        return this.users.getAll();
    }

    addUser(user) { this.users.add(user); }
    removeUser(user) { this.users.remove(user); }

    isAdmin(user) {
        // checking channel roles/affiliation for now
        // @TODO: check local admin list
        let userAffiliation;
        let userIsAdmin;

        if (typeof user === 'string') {
            const { affiliation } = this.getUser(user);
            userAffiliation = affiliation;
        } else if (typeof user === 'object') {
            const { affiliation } = user;
            userAffiliation = affiliation;
        }

        userIsAdmin = (userAffiliation === 'admin') ? true : false;

        return userIsAdmin;
    }
}
