const Event = require("../Event");
const { Events } = require("discord.js");

module.exports = class Error extends Event {
    constructor(client) {
        super(client, {
            name: Events.Error,
            once: false,
            log: false,
        });
    }

    /**
     *
     * @param {Error} error
     */
    async execute(error) {
        this.logger.warn(error);
    }
}
