const SlashCommand = require('../SlashCommand.js')
const { createEmbed } = require('../../../lib/embed')

/**
 * 
 */

module.exports = class Ping extends SlashCommand {
    constructor(client) {
        super(client,
            {
                name: 'ping',
                description: 'ping pong',
                default_member_permissions: 0,
                dm_permission: false,
                nsfw: false,
                module: 'Utils',
                permission_group: 'user'
            }
        )
    }

    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(interaction) {
        const message = await interaction.reply({
            embeds: [
                createEmbed({
                    title: "Pinging...",
                    description: "Please wait...",
                }),
            ],
            ephemeral: true
        });

        const ping = message.createdTimestamp - interaction.createdTimestamp;
        const dbPing = await this.client.pingDb()

        await interaction.editReply({
            embeds: [
                createEmbed({
                    title: "Pong!",
                    description: `Latency is \`${ping}ms\`\nAPI Latency is \`${Math.round(this.client.ws.ping)}ms\`\nDB Latency is \`${Math.round(dbPing)}ms\``,
                }),
            ],
            ephemeral: true,
        });
    }
}