//
//  User model
//
export default class User {
    constructor(state = {}) {
        const {
            name,
            color,
            affiliation,
            premium,
            role,
            staff
        } = state;

        this.name = name || null;
        this.color = color || null;

        this.role = role || 'none';
        this.affiliation = affiliation || 'none';

        // @TODO: unused ?
        this.premium = premium || 'false'; // use string, not bool
        this.staff = staff || 'false'; // use string, not bool
    }
}
