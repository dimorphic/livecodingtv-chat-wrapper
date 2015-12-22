// deps
import Client from '../client';
// import Users from '../models/users'; // move this?

import { TRIGGERS } from '../constants';
// import * as HANDLERS from './handlers';

//
//  Bot class
//
export default class Bot {
    constructor(options = {}) {
        const { config = {}, client = null } = options;

        if (!config.username || !config.password) {
            throw new Error('Bot needs username & password, bro!');
        }

        this.config = config;
        this.client = client;
        this.channel = config.channel || null; // home channel ?

        // channel and user list
        this.channels = [];
        this.users = [];

        // magic
        this.init();
    }

    init() {
        if (!this.client) {
            // boot new client
            this.client = new Client(this.config);
        }

        // setup / register bot custom handlers
        this.setHandlers();

        // connect
        this.connect();
    }

    connect() {
        this.client.connect();
    }

    setHandlers() {
        this.client.on(TRIGGERS.ONLINE, () => {
            console.log('!!! [BOT] ONLINE');
        });

        this.client.on(TRIGGERS.MESSAGE, () => {
            // @PSEUDO:
            // if user has access / is admin
            // listen message and look for command(s)
            // do stuffz
        });
    }

    join() {}
}
