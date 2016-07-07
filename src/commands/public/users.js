import { inspect } from '../../lib/helpers'; // @TODO: move this (again) ?

export default {
    active: true,

    trigger: 'users',
    handler: (bot) => {
        const users = bot.getUsers();

        console.log('Users:');
        console.log(inspect(users));
        // bot.say('Computer says no!');
    }
};
