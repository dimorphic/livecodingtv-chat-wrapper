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
        // check for user
        const exists = this.getUser(user);

        if (exists) {
            // ...update user data?
            // this.update(user);
            return void 0;
        }

        // create new user model
        this.list[user.name] = new User(user);
    }

    update(user) {
        // @TODO;
    }

    remove(user) {
        const exists = this.getUser(user);
        if (!exists) { return void 0; }

        delete this.list[user.name];
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
