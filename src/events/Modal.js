class Modal {
    constructor(client, options = {}) {
        /** @type {import('../Client.js')} */
        this.client = client;

        /** @type {import('pino').Logger} */
        this.logger = client.logger;

        this.name = options.name;
        this.db_group = options.db_group || [];
        this.cooldown = options.cooldown || 5;
        this.log = options.log || false;
    }

    /**
     *
     * @param {import('discord.js').Interaction} interaction
     * @returns
     */
    canExecute(interaction) {
        return true;
    }

    /**
     *
     * @param {import('discord.js').Interaction} interaction
     */
    async create(interaction) {}

    /**
     *
     * @param {import('discord.js').Interaction} interaction
     */
    async execute(interaction) {
        throw new Error(`Error! ${this.name} button does not have a execute() method.`);
    }
}

module.exports = Modal