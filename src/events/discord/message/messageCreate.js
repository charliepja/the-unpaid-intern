const Event = require('../../Event')
const { Events } = require('discord.js')

module.exports = class MessageCreate extends Event {
    constructor(client) {
        super(client, {
            name: Events.MessageCreate,
            once: false,
            log: false
        })
    }

    /**
     * 
     * @param {import('discord.js').Message} message 
     */
    async execute(message) {
        if(message.author.bot || !message.content || !message.guild) return

        const prefix = await this.client.prefixes.get(message.guild.id) || process.env.DEFAULT_PREFIX

        if(message.content.startsWith(prefix.toLowerCase())) {
            const args = message.content.slice(prefix.length).split(/ +/g)
            const cmdName = args.shift().toLowerCase()
            const cmd = this.client.getCommand(cmdName)

            if(cmd === undefined) return
            if(!cmd.canExecute(message)) return
            // Add Cooldown Checking

            try {
                return await cmd.execute(message, args)
            } catch (error) {
                this.logger.error(`There was an error while trying to run a prefix command: ${error}`);
            }
        }
    }
}