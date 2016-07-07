// deps
import Bot from './lib/bot';
import CONFIG from './config';
import COMMANDS from './commands';

// settings
const INTERACTIVE = true;

// setInterval(() => {
//     console.log(require('util').inspect(process.memoryUsage()));
// }, 1000);

//
//  Fishbot - LCTV bot example
//
const Fishbot = new Bot({
    config: CONFIG,
    commands: COMMANDS
});

Fishbot.on('command', (data) => {
    console.log('got command : ', data);
    Fishbot.say('Hell no! <*)))><');
});

Fishbot.on('presence', (data) => {
    const { fromPast, from, type } = data;

    // console.log('fish presence @ ', data);

    // welcome?
    // @TODO: fix frompast
    // if (!fromPast && type === 'join') {
    //     // Fishbot.say(`Welcome ${from.name}. Stay cool!`);
    //     console.log(`Welcome ${from.name}. Stay cool!`);
    // }
});

Fishbot.on('join', (data) => {
    console.log('join @ ', data);
});

// interactive CLI
if (INTERACTIVE) {
    process.stdin.setEncoding('utf8'); // prolly at top of file/module?

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            // process.stdout.write('data: ' + chunk);
            Fishbot.say(chunk);
        }
    });

    process.stdin.on('end', () => { process.stdout.write('end'); });
    process.on('exit', () => { console.log('proc exit!'); });
}
