export default {
    active: true,
    type: 'event',
    trigger: 'join',

    handler: (bot, data) => {
        const { from, fromPast } = data;
        const { name } = from;

        console.log(`Welcome ${name}! Stay cool! (${fromPast})`);
        // bot.say(`Run ${name}.`);
    }
};
