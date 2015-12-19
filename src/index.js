// deps
import Client from './lib/client';
import colorize from 'colorize-str';

// settings
import * as CONFIG from './config';
const INTERACTIVE = true;

//
//  Fishbot
//
const Fishbot = new Client(CONFIG);

// handlers
Fishbot.on('online', () => {
    console.log('!!!!! i are online!');
});

Fishbot.on('message', (data) => {
    const { from, message } = data;

    const log = colorize(`{#f00}[CHAT] {#fff}${from} {#999}: ${message}`);
    console.log(log);
});

Fishbot.on('command', (data) => {
    // console.log('got command : ', data);
    Fishbot.message('Hell no! <*)))><');
});

Fishbot.on('presence', (data) => {
    const { from, type } = data;
    const { name, affiliation, role } = from;

    let userAction;
    switch (type) {
        case 'join':
            userAction = '~>>>';
            break;
        case 'part':
            userAction = '<<<~';
            break;
        default:
            break;
    }

    const log = colorize(`{#0f0}[${userAction}] {#fff}${name} (${affiliation}/${role})`);
    console.log(log);
});

// Fishbot.on('join', (data) => {});
// Fishbot.on('part', (data) => {});

// interactive CLI
if (INTERACTIVE) {
    process.stdin.setEncoding('utf8'); // prolly at top of file/module?

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            // process.stdout.write('data: ' + chunk);
            Fishbot.message(chunk);
        }
    });

    process.stdin.on('end', () => { process.stdout.write('end'); });
    process.on('exit', () => { console.log('proc exit!'); });
}
