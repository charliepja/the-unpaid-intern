const Event = require('../Event.js');

module.exports = class Ready extends Event {
    constructor(client) {
        super(client, {
            name: 'ready',
            once: true
        });
    }

    async execute() {
        this.logger.info(`Logged in as ${this.client.user.tag}! (${this.client.user.id})`);
    }
}