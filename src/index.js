
// deps
import Client from './lib/client';
import colorize from 'colorize-str';

// settings
import * as CONFIG from './config';
const INTERACTIVE = true;

//
//  LCTV
//
const LCTV = new Client(CONFIG);

// handlers
LCTV.on('presence', (data) => {
    const { from, type } = data;
    const { name, affiliation, role } = from;

    const userAction = (type === 'part') ? '<<<' : '>>>';

    const log = colorize(`{#0f0}[${userAction}] {#fff}${name} (${affiliation}/${role})`);
    console.log(log);
});

LCTV.on('message', (data) => {
    const { from, message } = data;

    const log = colorize(`{#f00}[CHAT] {#fff}${from} {#999}: ${message}`);
    console.log(log);
});

// go live!
LCTV.connect();

// interactive CLI
if (INTERACTIVE) {
    process.stdin.setEncoding('utf8'); // prolly at top of file/module?

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            // process.stdout.write('data: ' + chunk);
            LCTV.message(chunk);
        }
    });

    process.stdin.on('end', () => { process.stdout.write('end'); });
    process.on('exit', () => { console.log('proc exit!'); });
}
