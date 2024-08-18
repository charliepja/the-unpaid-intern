const SlashCommand = require('../SlashCommand.js')
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType } = require('discord.js')

/**
 * 
 */

module.exports = class Welcome extends SlashCommand {
    constructor(client) {
        super(client,
            {
                name: 'welcome',
                description: 'ping pong',
                default_member_permissions: 0,
                dm_permission: false,
                nsfw: false,
                module: 'Utils',
                permission_group: 'admin',
                stringOption: {
                    name: 'type',
                    description: 'message type',
                    required: true,
                    choices: [
                        { name: 'Embed', value: 'embed' },
                        { name: 'Message', value: 'message' },
                        { name: 'Embed & Message', value: 'embedandmessage' }
                    ]
                },
                channelOption: {
                    name: 'channel',
                    description: 'the channel',
                    required: true,
                    channel_types: ChannelType.GuildText
                },
                booleanOption: {
                    name: 'addimage',
                    description: 'Add image',
                    required: true,
                }
            }
        )
    }

    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     * 
     * /welcome embed .... imgurl
     * 
     * /welcome addimage<true/false> channel<lists channels> type<embed,message,embed & message>
     * ?welcome addImage channel type
     * 
     * Modal
     * 
     * new TH_Modal({mainOptions}, {options}, <args>)
     */
    async execute(interaction) {
        const type = interaction.options.getString('type')
        const channel = interaction.options.getChannel('channel')
        const image = interaction.options.getBoolean('addimage')
        const modal =
            new ModalBuilder()
                .setCustomId('welcome-modal')
                .setTitle('Guild Welcome Settings')

        if (type === 'embed') {
            const embedMessage =
                new TextInputBuilder()
                    .setCustomId('welcome-modal-embedmessage')
                    .setLabel('Provide embed message')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(2048)
            
            modal.addComponents(new ActionRowBuilder().addComponents(embedMessage))
        } else if (type === 'message') {
            const welcomeMessage =
                new TextInputBuilder()
                    .setCustomId('welcome-modal-message')
                    .setLabel('Provide welcome message')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(2048)
                
            modal.addComponents(new ActionRowBuilder().addComponents(welcomeMessage))
        } else if (type === 'embedandmessage') {
            const embedMessage =
                new TextInputBuilder()
                    .setCustomId('welcome-modal-embedmessage')
                    .setLabel('Provide the message for the embed')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(2048)
            const welcomeMessage =
                new TextInputBuilder()
                    .setCustomId('welcome-modal-message')
                    .setLabel('Provide welcome message')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(2048)

            modal.addComponents(
                new ActionRowBuilder().addComponents(embedMessage),
                new ActionRowBuilder().addComponents(welcomeMessage)
            )
        } else {
            this.client.logger.error(`welcome.js slash command got type ${type} which is not allowed <message, embed, embedandmessage>`)
        }

        await interaction.showModal(modal)
    }
}