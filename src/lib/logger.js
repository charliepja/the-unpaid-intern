const pino = require('pino')
const { WebhookClient } = require('discord.js')

class Logger {
    constructor() {
        this.date = new Date();
        this.webhookLogger = process.env.ERROR_LOGS ? new WebhookClient({ url: process.env.ERROR_LOGS }) : undefined;
        this.action = pino.default({
            level: 'debug',
        }, pino.multistream([{
            level: 'debug',
            stream: pino.transport({
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'yyyy-mm-dd HH:mm:ss',
                    ignore: 'pid,hostname',
                    singleLine: false,
                    hideObject: false,
                    customColors: 'info:blue,warn:yellow,error:red'
                }
            })
        }, {
            level: 'debug',
            stream: pino.destination({
                dest: `${process.cwd()}/logs/combined-${this.date.getFullYear()}.${this.date.getMonth() + 1}.${this.date.getDate()}.log`,
                sync: true
            })
        }]))
        
        return this.action;
    }
}

module.exports = Logger;