// deps
// import Client from './lib/client';
import Client from './lib/client-class'; // go class?!
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

    const log = colorize(`{#f00}[CHAT] {#fff}${from} {#999}: ${message}`); // will fail...?
    console.log(log);
});

Fishbot.on('command', (data) => {
    console.log('got command : ', data);
    // Fishbot.message('Hell no! <*)))><');
});

Fishbot.on('presence', (data) => {
    const { user, details } = data.from;
    const info = JSON.stringify(details);

    const action = 'joined'; // @TODO

    const log = colorize(`{#0f0}[>>] {#fff}${user} {#555}${action}`);
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
