const { EmbedBuilder } = require("discord.js");
const { resolveColor } = require('./lib')

/**
 * A utility class for creating Discord embeds.
 */
class LibEmbed {
    /**
     * Creates a new Discord embed with the provided options.
     * @param {{
     *  color: string,
     *  title: string,
     *  url: string,
     *  description: string,
     *  author: { name: string, url: string, icon_url: string },
     *  thumbnail: { url: string },
     *  image: { url: string },
     *  footer: { text: string, icon_url: string },
     *  fields: { name: string, value: string, inline: boolean }[]
     *  timestamp: boolean,
     * }} embed
     * @returns {EmbedBuilder|EmbedBuilder[]} An array of Discord embeds.
     */
    static createEmbed(embed) {
        if (!embed) throw new Error("No embeed options provided to createEmbed().");
        if (!Array.isArray(embed))
            return new EmbedBuilder({
                color: resolveColor("#FF00FF"),
                ...embed,
            });

        return embed.map(
            (option) =>
                new EmbedBuilder({
                    color: resolveColor("#FF00FF"),
                    ...embed,
                })
        );
    }
}

module.exports = LibEmbed