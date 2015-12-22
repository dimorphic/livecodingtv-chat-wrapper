//
//  User model
//
export default class User {
    constructor(state = {}) {
        const { name, color, role, affiliation } = state;

        this.name = name || null;
        this.color = color || null;

        this.role = role || null;
        this.affiliation = affiliation || null;
    }
}
