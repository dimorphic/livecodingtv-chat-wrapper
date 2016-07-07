import User from './user';

//
//  Users
//  factory / service / singleton ? mmhmmm...
//
export default class Users {
    constructor(list = {}) {
        this.list = list;
    }

    getAll() {
        return this.list;
    }

    getUser(userId) {
        if (this.list.hasOwnProperty(userId)) {
            return this.list[userId];
        }

        return false;
    }

    add(user) {
        // console.log('add user @', user);

        // check for user
        const exists = this.getUser(user.name);

        if (exists) {
            // ...update user data
            this.update(exists.name, user);
            return void 0;
        }

        // create new user model
        // @TODO: lowercase username key?
        // const username = (user.name).toLowerCase();
        this.list[user.name] = new User(user);
    }

    update(userId, newState) {
        const user = this.getUser(userId);
        if (!user || !newState) { return void 0; }

        console.log('updating user @ ', user);

        // loop thru state
        for (const item in newState) {
            // if local data invalid
            if (user[item] !== newState[item]) {
                // ...update it
                user[item] = newState[item];
            }
        }
    }

    remove(user) {
        // console.log('remove user @', user);

        const exists = this.getUser(user.name);
        if (!exists) { return void 0; }

        delete this.list[exists.name];
    }

    count() {
        // cache hasOwn
        const hasOwn = Object.prototype.hasOwnProperty;

        // console.time('CountStart');

        // @TODO: try Object.keys().length speed and compare?
        let counter = 0;
        for (const user in this.list) {
            if (hasOwn.call(this.list, user)) {
                ++counter;
            }
        }

        // console.timeEnd('CountStart');
        return counter;
    }
}
