/** 
* @typedef {import('pino').Logger} logger
* @typedef {import('discord.js').Client} client
*/

/**
* Class represting a command that must be called using Guild prefix
* @class
*/
class PrefixCommand {
   /**
    * Create a command
    * 
    * @param {client} client Instance of Discord Client
    * @param {Object} options Command properties
    * @param {string} options.name Command name
    * @param {string} options.description Command description
    * @param {string} options.module Command module
    * @param {boolean} options.nsfw Does Command return nsfw content?
    * @param {string} options.db_group Command DB permissions group
    */
   constructor(client, options = {}) {
       this.client = client
       this.logger = client.logger

       this.name = options.name
       this.description = options.description
       this.module = options.module
       this.nsfw = options.nsfw
       this.permission_group = options.permission_group
   }

   /**
    * Determins if user has sufficent permissions to run command
    *
    * @param {Discord.Message} msg Message that called command
    *
    * @returns {boolean} Whether use can run command
    */
   canExecute(msg) {
       return true
   }

   /**
    * Executes Command
    *
    * @param {Discord.Message} message Message that called command
    *
    */
   async execute(message) {
       throw new Error(`Error! ${this.name} prefix command does not have a execute() method.`)
   }
}

module.exports = PrefixCommand