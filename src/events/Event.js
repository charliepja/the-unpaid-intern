class Event {
    /**
     * Creates an instance of Event.
     * @constructor
     * @param {import('../Client.js')} client - The client instance.
     * @param {Object} options - Additional options for the event.
     * @param {string} options.name - The name of the event.
     * @param {boolean} [options.once=false] - Whether the event should only be executed once.
     * @param {boolean} [options.log=false] - Whether logging for this event is enabled.
     */
    constructor(client, options = {}) {
        /** @type {import('../Client.js')} */
        this.client = client;

        /** @type {import('pino').Logger} */
        this.logger = client.logger;

        this.name = options.name;
        this.once = options.once || false;
        this.log = options.log || false;
    }

    /**
     * Executes the event handler.
     * @abstract
     * @param {...any} args - Arguments passed to the event handler.
     * @returns {Promise<void>} A Promise that resolves when the execution is complete.
     * @throws {Error} If the event handler does not implement the execute method.
     */
    async execute(args) {
        throw new Error(`Error! ${this.name} event does not have a execute() method.`);
    }
}

module.exports = Event