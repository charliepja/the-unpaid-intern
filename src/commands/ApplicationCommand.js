/**
 * Define JSON
 * @typedef {string} JSON
 */

class ApplicationCommand {
    constructor(client, options = {}) {
        /**
         * @type {import('../Client.js')}
         */
        this.client = client
        this.name = options.name
        this.description = options.description
        this.default_member_permissions = options.default_member_permissions
        this.dm_permission = options.dm_permission
        this.nsfw = options.nsfw
        this.module = options.module
        this.permission_group = options.permission_group
    }

    /**
     * Determins if user has sufficent permissions to run command
     * 
     * @param {Discord.interaction} msg Interaction that called command
     * 
     * @returns {boolean} Whether use can run command
     */
    canExecute(msg) {
        return true
    }

    /**
     * Executes Command
     * 
     * @param {Discord.interaction} interaction Interaction that called command
     * 
     */
    async execute(interaction) {
        throw new Error(`Error! ${this.name} slash command does not have a execute() method.`)
    }
}

module.exports = ApplicationCommand