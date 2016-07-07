//
//  Command model
//
export default class Command {
    constructor(options = {}) {
        const { trigger, handler, active, type } = options;

        // command trigger and handler
        this.trigger = trigger;
        this.handler = handler || (() => {
            throw new Error('Need command handler, bro!');
        });

        // optional active and type flags
        this.active = active || true;
        this.type = type || 'public'; // public, admin, event?
    }

    // run(args = []) {
    //     this.handler.call(this, args);
    // }
}
