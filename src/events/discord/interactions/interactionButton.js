const Lib = require('../../../lib/lib')
const Event = require('../../Event')

module.exports = class InteractionButton extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionButton',
            once: false,
            log: false
        })
    }

    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(interaction) {
        const customId = interaction.customId.split('?')[0]
        const args = Lib.getInteractionArgs(interaction.customId)
        const button = this.client.getButton(customId)

        if(button === undefined) return
        if(!button.canExecute(interaction)) return
        // Add Cooldown Checking

        try {
            return await button.execute(interaction, args)
        } catch (error) {
            this.logger.error(`There was an error while trying to run a modal: ${error}`)
        }
    }
}