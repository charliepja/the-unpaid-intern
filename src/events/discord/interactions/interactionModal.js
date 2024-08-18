const Lib = require('../../../lib/lib')
const Event = require('../../Event')

module.exports = class InteractionModal extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionModal',
            once: false,
            log: false
        })
    }

    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     * @param {string} type 
     */
    async execute(interaction, type) {
        const customId = interaction.customId.replace('modal:', '').split('?')[0]
        const args = Lib.getInteractionArgs(interaction.customId)
        const modal = this.client.getModal(customId)

        if(modal === undefined) return
        if(!modal.canExecute(interaction)) return
        // Add Cooldown Checking

        try {
            switch (type) {
                case 'create':
                    const createModal = await modal.create(interaction, args)
                    if(!createModal.data && !createModal.components) return

                    return await interaction.showModal(createModal)
                case 'execute':
                    return await modal.execute(interaction, args)
            }
        } catch(error) {
            this.logger.error(`There was an error while trying to run a modal: ${error}`)
        }
    }
}