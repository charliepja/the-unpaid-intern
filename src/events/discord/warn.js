const Event = require('../Event')
const { Events } = require('discord.js')

module.exports = class Warn extends Event {
    constructor(client) {
        super(client, {
            name: Events.Warn,
            once: false,
            log: false
        })
    }

    /**
     * 
     * @param {string} warning 
     */
    async execute(warning) {
        this.logger.warn(warning)
    }
}