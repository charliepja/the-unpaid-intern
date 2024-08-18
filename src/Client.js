const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require('discord.js');
const Keyv = require('keyv');
const mongoose = require("mongoose");
const Logger = require('./lib/logger.js');
const Lib = require('./lib/lib.js');

class TU_Intern extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildScheduledEvents,
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User,
            ],
        });

        /** @type {import('keyv')} */
        this.prefixes = new Keyv(process.env.MONGO_CONNECTION, { namespace: "prefixes" });

        /** @type {import('discord.js').Collection<string, import('./commands/application/SlashCommand.js')>} */
        this.slashCommands = [];
        this.slashCommandsIndex = new Collection();

        /** @type {import('discord.js').Collection<string, import('./commands/application/ContextMenuCommand.js')>} */
        this.userCommands = [];
        this.userCommandsIndex = new Collection();

        /** @type {import('discord.js').Collection<string, import('./commands/application/ContextMenuCommand.js')>} */
        this.messageCommands = [];
        this.messageCommandsIndex = new Collection();

        /** @type {import('discord.js').Collection<string, import('./commands/PrefixCommand.js')>} */
        this.commands = [];
        this.commandIndex = new Collection();

        /** @type {import('discord.js').Collection<string, import('./events/Button.js')>} */
        this.buttons = [];
        this.buttonIndex = new Collection();

        /** @type {import('discord.js').Collection<string, import('./events/Modal.js')>} */
        this.modals = [];
        this.modalIndex = new Collection();

        /** @type {import('pino').Logger} */
        this.logger = new Logger();
    }

    /**
     *
     */
    async start() {
        await Promise.all([
            this.connectDb(),
            this.registerEvents(),
            this.registerModals(),
            this.registerButtons(),
            this.registerPrefixCommands(),
            this.registerApplictionCommands()
        ]);

        await super.login(process.env.CLIENT_TOKEN);
    }

    async reloadApplicationCommands(commands) {
        const rest = new REST().setToken(process.env.CLIENT_TOKEN);

        try {
            this.logger.info("Refreshing Application Commands");

            const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, '1133117637556191413'), { body: commands });

            this.logger.info("Successfully refreshed Application Commands");
        } catch (error) {
            this.logger.error(`Unable to refresh Application Commands \n ${error}`);
        }
    }

    captureApplicationCommands(path, type) {
        const commandFiles = Lib.getFilesRecursive(path);
        const applicationCommands = [];

        for (const file of commandFiles) {
            const command = require(file);
            const commandInstance = new command(this)

            applicationCommands.push(commandInstance.commandData());

            switch (type) {
                case 'message':
                    this.messageCommandsIndex.set(commandInstance.name, this.messageCommands.length);
                    this.messageCommands.push(commandInstance);
                    break;
                case 'user':
                    this.userCommandsIndex.set(commandInstance.name, this.userCommands.length);
                    this.userCommands.push(commandInstance);
                    break;
                case 'slash':
                    this.slashCommandsIndex.set(commandInstance.name, this.slashCommands.length);
                    this.slashCommands.push(commandInstance);
                    break;
            }
        }

        return applicationCommands;
    }

    /**
     *
     */
    async registerApplictionCommands() {
        const messageApplicationCommands = this.captureApplicationCommands('./src/commands/application/message', 'message')
        const userApplicationCommands = this.captureApplicationCommands('./src/commands/application/user', 'user');
        const slashApplicationCommands = this.captureApplicationCommands('./src/commands/application/slash', 'slash');

        const contextMenuApplicationCommands = 
            messageApplicationCommands.length > 0 && userApplicationCommands.length > 0 ?
                [...messageApplicationCommands, ...userApplicationCommands]
                : []
        try {
            await this.reloadApplicationCommands(contextMenuApplicationCommands)
            await this.reloadApplicationCommands(slashApplicationCommands);
        } catch (error) {
            this.logger.error("Unable to register Application Commands");
        }
    }

    /**
     *
     */

    async registerPrefixCommands() {
        const messageCommandFiles = Lib.getFilesRecursive("./src/commands/prefix/**");
        const messageCommands = [];
    }

    /**
     * Gets all discord event files and adds event listeners to the client
     * @returns {boolean} Were the events setup successfully
     */
    async registerEvents() {
        try {
            const events = Lib.getFilesRecursive("./src/events/discord");

            for (const file of events) {
                const Event = require(file);

                if (!Lib.isClass(Event)) {
                    this.logger.debug(`Skipping ${file} as it is not a class.`);
                    continue;
                }

                const eventInstance = new Event(this);

                if (eventInstance.once) {
                    this.once(eventInstance.name, (...args) => eventInstance.execute(...args));
                } else {
                    this.on(eventInstance.name, (...args) => eventInstance.execute(...args));
                }
            }

            return true;
        } catch (error) {
            this.logger.error(`Error registering events: ${error}`);
            return false;
        }
    }

    /**
     * Gets all button files and adds them to the client
     * @returns {boolean} Were the buttons setup successfully
     */
    async registerButtons() {
        try {
            const buttons = Lib.getFilesRecursive("./src/events/buttons");

            for (const file of buttons) {
                const Button = require(file);

                if (!Lib.isClass(Button)) {
                    this.logger.debug(`Skipping ${file} as it is not a class.`);
                    continue;
                }

                const buttonInstance = new Button(this);

                if (this.buttonIndex.has(buttonInstance.name)) {
                    this.logger.debug(`Duplicate button found: ${buttonInstance.name} - ${file}`);
                    continue;
                }

                this.buttonIndex.set(buttonInstance.name, this.buttons.length);
                this.buttons.push(buttonInstance);

                return true;
            }
        } catch (error) {
            this.logger.error(`Error registering buttons: ${error}`);
            return false;
        }
    }

    /**
     *
     */
    async registerModals() {
        try {
            const modals = Lib.getFilesRecursive("./src/events/modals");

            for (const file of modals) {
                const Modal = require(modal);

                if (!Lib.isClass(Modal)) {
                    this.logger.debug(`Skipping ${file} as it is not a class.`);
                    continue;
                }

                const modalInstance = new Modal(this);

                if (this.modalIndex.has(modalInstance.name)) {
                    this.logger.debug(`Duplicate modal found: ${modalInstance.name} - ${file}`);
                    continue;
                }

                this.modalIndex.set(modalInstance.name, this.modals.length);
                this.modals.push(modalInstance);

                return true;
            }
        } catch (error) {
            this.logger.error(`Error registering modals: ${error}`);
            return false;
        }
    }

    /**
     * Establishes a connection to the MongoDB database using Mongoose.
     * @async
     * @returns {Promise<boolean>} A Promise that resolves to true if the connection is successful, false otherwise.
     */
    async connectDb() {
        try {
            await mongoose.connect(process.env.MONGO_CONNECTION);

            this.connection = mongoose.connection;
            this.logger.info("MongoDb connection established.");

            return true;
        } catch (error) {
            this.logger.error(`Error connecting to the database: ${error}`);
            return false;
        }
    }

    /**
     * Pings the MongoDB database to check the latency of the connection.
     * @async
     * @returns {Promise<number>} A Promise that resolves to the latency in milliseconds.
     */
    async pingDb() {
        const cNano = process.hrtime();
        await this.connection.db.command({ ping: 1 });
        const time = process.hrtime(cNano);
        return (time[0] * 1e9 + time[1]) * 1e-6;
    }

    /**
     * Gets the button from the index
     * @param {string} customId - The customId of the button
     * @returns {import('@Structures/Button.js')}
     */
    getButton(customId) {
        const getIndex = this.buttonIndex.get(customId);
        return getIndex !== undefined ? this.buttons[getIndex] : undefined;
    }

    /**
     * Gets the modal from the index
     * @param {string} customId - The customId of the modal
     * @returns {import('@Structures/Modal.js')}
     */
    getModal(customId) {
        const getIndex = this.modalIndex.get(customId);
        return getIndex !== undefined ? this.modals[getIndex] : undefined;
    }

    getSlashCommand(customId) {
        const getIndex = this.slashCommandsIndex.get(customId);
        return getIndex !== undefined ? this.slashCommands[getIndex] : undefined;
    }

    getMessageCommand(customId) {
        const getIndex = this.messageCommandsIndex.get(customId);
        return getIndex !== undefined ? this.messageCommands[getIndex] : undefined;
    }

    getUserCommand(customId) {
        const getIndex = this.userCommandsIndex.get(customId);
        return getIndex !== undefined ? this.userCommands[getIndex] : undefined;
    }

    /**
     * Gets the command from the index
     * @param {string} name - The name of the command
     * @returns {import('@Structures/Command.js')}
     */
    getCommand(name) {
        const getIndex = this.commandIndex.get(name);
        return getIndex !== undefined ? this.commands[getIndex] : undefined;
    }
}

module.exports = TU_Intern;