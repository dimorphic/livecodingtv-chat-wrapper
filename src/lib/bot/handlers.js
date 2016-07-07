// deps
import colorize from 'colorize-str';

// event types
import { CLIENT, BOT } from '../constants';

//
//  online handler
//
export function onOnline(data) {
    console.log('!!! [BOT] ONLINE');
    this.emit(BOT.ONLINE, data);
}

//
//  client presence handler
//
export function onPresence(data) {
    // @PSEUDO
    // join -> welcome message ?
    // part?
    const { from, fromPast, type } = data;
    const { name, affiliation, role } = from;

    // treat channel / user action
    switch (type) {
        // add user to channel users list
        case CLIENT.CHANNEL_JOIN:
            this.addUser(from);
            this.emit(BOT.JOIN, data); // for commodity
            break;
        // remove user from channel users list
        case CLIENT.CHANNEL_PART:
            this.removeUser(from);
            this.emit(BOT.PART, data); // for commodity
            break;
        default:
            break;
    }

    // broadcast/mirror presence event
    this.emit(BOT.PRESENCE, data);

    // @DEBUG: log to console
    const userAction = (type === 'part') ? '<<<' : '>>>';
    const log = colorize(`{#0f0}[${userAction}] {#fff}${name} (${affiliation}/${role})`);
    console.log(log);
}

//
//  message handler
//
export function onMessage(data) {
    // spread message and author data
    const { from, message } = data;

    const user = this.getUser(from);
    const { name = from } = user;
    const color = user.color || '#fff';

    const log = `{#f00}[CHAT] {${color}}${name} {#999}: ${message}`;
    // console.log('log @ ', log);
    console.log(colorize(log));
}

//
//  command handler
//
export function onCommand(data) {
    // @PSEUDO:
    // if user has access / is admin
    // listen message and look for command(s)
    // do stuffz
    // emit command + args
    const { from, command, args } = data;
    const user = this.getUser(from) || from;

    // if this.isAdmin(user) -> check cmd
    // if COMMANDS[command] -> COMMANDS[command].magicHandler.call(this, args)

    // console.log('CMD @ ', command);
    // console.log('from @ ', user);
    // console.log('users: ', this.users);
    // console.log('MATCHED CMD : ', this.commands[command]);

    const cmd = this.commands[command];

    if (cmd && (typeof cmd.handler === 'function')) {
        cmd.handler(this, args);
    }
}
