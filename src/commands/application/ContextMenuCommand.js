// https://discord.js.org/docs/packages/builders/main/ContextMenuCommandBuilder:Class
// https://github.com/discordjs/discord.js/blob/main/packages/builders/src/interactions/contextMenuCommands/ContextMenuCommandBuilder.ts

const { ContextMenuCommandBuilder } = require('discord.js')

class ContextMenuCommand extends ApplicationCommand {
    constructor(client, options = {}) {
        super(
            client,
            options.name,
            options.description,
            options.default_member_permissions,
            options.dm_permission,
            options.nsfw,
            options.module,
            options.permission_group,
        );

        this.type = options.type
    }

    /**
     * Builds Slash Command to be ready for deployment
     *
     * @returns {JSON} SlashCommandBuilder#toJSON()
     */
    commandData() {
        const cmdData = 
            new ContextMenuCommandBuilder()
                .setDefaultMemberPermissions(this.default_member_permissions)
                .setDMPermission(this.dm_permission)
                .setName(this.name)
                .setNameLocalizations(this.name_localizations)
                .setType(this.type)

        return cmdData.toJSON();
    }
}

module.exports = ContextMenuCommand