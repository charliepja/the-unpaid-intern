// https://discord.js.org/docs/packages/builders/main/SlashCommandBuilder:Class

const ApplicationCommand = require('../ApplicationCommand')
const ApplicationOptions = require('./ApplicationOptions')
const {
    SlashCommandBuilder,
    ApplicationCommandOptionBase,
    SharedNameAndDescription,
    SlashCommandAttachmentOption,
    SlashCommandBooleanOption,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandMentionableOption,
    SlashCommandNumberOption,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandUserOption
} = require('discord.js')

class SlashCommand extends ApplicationCommand {
    constructor(client, options = {}) {
        super(
            client,
            {
                name: options.name,
                description: options.description,
                default_member_permissions: options.default_member_permissions,
                dm_permission: options.dm_permission,
                nsfw: options.nsfw,
                module: options.module,
                permission_group: options.permission_group,
            }
        );

        this.attachmentOption = options.attachmentOption
        this.booleanOption = options.booleanOption
        this.channelOption = options.channelOption
        this.integerOption = options.integerOption
        this.mentionableOption = options.mentionableOption
        this.numberOption = options.numberOption
        this.roleOption = options.roleOption
        this.stringOption = options.stringOption
        this.subCommand = options.subCommand
        this.subCommandGroup = options.subCommandGroup
        this.userOption = options.userOption
    }

    createNewSlashCommand() {
        const slashCmd =
            new SlashCommandBuilder()
                .setDefaultMemberPermissions(this.default_member_permissions)
                .setDescription(this.description)
                .setDMPermission(this.dm_permission)
                .setName(this.name)
                .setNSFW(this.nsfw)

        return slashCmd
    }

    /**
     * 
     * @param {ApplicationCommandOptionBase} option 
     * @param {*} data 
     * @returns 
     */
    setOptionData(option, data) {
        option.setName(data.name)
        option.setDescription(data.description);

        if(data.description_localizations) option.setDescriptionLocalizations(data.description_localizations);
        if(data.name_localizations) option.setNameLocalizations(data.name_localizations);
        if(data.required) option.setRequired(data.required);
        if(data.channel_types) option.addChannelTypes(data.channel_types);
        if(data.autocomplete) option.setAutocomplete(data.autocomplete);
        if(data.choices) option.addChoices(data.choices);
        if(data.max_value) option.setMaxValue(data.max_value);
        if(data.min_value) option.setMinValue(data.min_value);
        
        return option
    }

    addSlashCommandOptions() {
        const slashCmd = this.createNewSlashCommand()

        this.attachmentOption != null ? slashCmd.addAttachmentOption(this.setOptionData(new SlashCommandAttachmentOption(), this.attachmentOption)) : null
        this.booleanOption != null ? slashCmd.addBooleanOption(this.setOptionData(new SlashCommandBooleanOption(), this.booleanOption)) : null
        this.channelOption != null ? slashCmd.addChannelOption(this.setOptionData(new SlashCommandChannelOption(), this.channelOption)) : null
        this.integerOption != null ? slashCmd.addIntegerOption(this.setOptionData(new SlashCommandIntegerOption(), this.integerOption)) : null
        this.mentionableOption != null ? slashCmd.addMentionableOption(this.setOptionData(new SlashCommandMentionableOption(), this.mentionableOption)) : null
        this.numberOption != null ? slashCmd.addNumberOption(this.setOptionData(new SlashCommandNumberOption(), this.numberOption)) : null
        this.roleOption != null ? slashCmd.addRoleOption(this.setOptionData(new SlashCommandRoleOption(), this.roleOption)) : null
        this.stringOption != null ? slashCmd.addStringOption(this.setOptionData(new SlashCommandStringOption(), this.stringOption)) : null
        // this.subCommand != null ? slashCmd.addSubcommand(this.setOptionData(new SlashCommandSubcommandBuilder(), this.subCommand)) : null
        // this.subCommandGroup != null ? slashCmd.addSubcommandGroup(this.setOptionData(new SlashCommandSubcommandGroupBuilder(), this.subCommandGroup)) : null
        this.userOption != null ? slashCmd.addUserOption(this.setOptionData(new SlashCommandUserOption(), this.userOption)) : null

        return slashCmd
    }

    /**
     * Builds Slash Command to be ready for deployment
     *
     * @returns {JSON} SlashCommandBuilder#toJSON()
     */
    commandData() {
        const slashCmd = this.addSlashCommandOptions()

        return slashCmd.toJSON();
    }
}

module.exports = SlashCommand
