const Event = require('../../Event')
const { Events } = require('discord.js')

module.exports = class InteractionCreate extends Event {
    constructor(client) {
        super(client, {
            name: Events.InteractionCreate,
            once: false,
            log: false
        })
    }

    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(interaction) {
        if(interaction.isChatInputCommand()) {
            const slashCommand = this.client.getSlashCommand(interaction.commandName);

            if(slashCommand === undefined) return
            if(!slashCommand.canExecute()) return
            return await slashCommand.execute(interaction)
        }

        if (interaction.isModalSubmit() || (interaction.isButton() && interaction.customId.startsWith("modal:"))) {
            return this.client.emit(
                "interactionModal",
                interaction,
                interaction.isModalSubmit() ? "execute" : "create"
            );
        }

        if(interaction.isButton()) {
            return this.client.emit(
                "interactionButton",
                interaction
            );
        }
    }
}