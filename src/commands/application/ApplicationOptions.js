const { ApplicationCommandOptionBase } = require('discord.js')

class ApplicationOptions {
    constructor(options) {
        this.name = options.name
        this.description = options.description
        this.required = options.require || false
    }

    createApplicationOptions() {
        const appOpts = 
            new ApplicationCommandOptionBase()
                .setName(this.name)
                .setDescription(this.description)
                .setRequired(this.required)
        
        return appOpts
    }
}

module.exports = ApplicationOptions