// deps
// import Client from './lib/client';
import Bot from './lib/bot';
import colorize from 'colorize-str';
import CONFIG from './config';

// settings
const INTERACTIVE = false;

//
//  Fishbot
//
const Fishbot = new Bot({
    config: CONFIG
});

// console.log('Fish @ ', Fishbot);

// handlers
// Fishbot.on('online', () => {
//     console.log('!!!!! FISH ONLINE!');
// });

/*
Fishbot.on('message', (data) => {
    const { from, message } = data;

    const log = colorize(`{#f00}[CHAT] {#fff}${from} {#999}: ${message}`);
    console.log(log);
});

Fishbot.on('command', (data) => {
    console.log('got command : ', data);
    Fishbot.message('Hell no! <*)))><');

    console.log(Fishbot.users);
});

Fishbot.on('presence', (data) => {
    const { from, type } = data;
    const { name, affiliation, role } = from;

    const userAction = (type === 'part') ? '<<<' : '>>>';

    const log = colorize(`{#0f0}[${userAction}] {#fff}${name} (${affiliation}/${role})`);
    console.log(log);
});
*/

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
