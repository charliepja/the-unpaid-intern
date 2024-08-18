const { globSync } = require('glob'); 
const path = require('node:path')

class Lib {
    /**
     * Returns true/false if object is class or not
     * @param {object} input
     * @returns {boolean} Is object class or not
     */
    static isClass(input) {
        return typeof input === "function" && /^\s*class\s+/.test(input.toString());
    }

    /**
     * Retrieves a list of files recursively from a directory with a given extension.
     * @param {string} dir - The directory to search in.
     * @param {string} [extension] - The file extension to filter by. If not provided, returns all files.
     * @returns {string[]} An array of file paths.
     * @throws {Error} If the `dir` parameter is empty or falsy.
     */
    static getFilesRecursive(dir, extension) {
        if (!dir) throw new Error("Error! getFilesResursive was sent an empty path.");

        const files = globSync(`**/${extension ? `*.${extension}` : "*"}`, {
            cwd: path.resolve(dir),
            nodir: true,
        });

        return files.map((file) => path.resolve(dir, file));
    }

    /**
     * Resolves a color string to its hexadecimal representation.
     * @param {string} color - The color string to resolve, e.g., "#RRGGBB".
     * @returns {number} The hexadecimal representation of the color.
     * @throws {Error} If no color is provided or if the provided color is not a string.
     */
    static resolveColor(color) {
        if (!color) throw new Error("No color provided.");
        if (typeof color !== "string") throw new Error("Color must be a string.");

        return parseInt(color.replace("#", ""), 16);
    }

    /**
     * Parses interaction arguments from a custom ID string.
     * @param {string} customId - The custom ID string containing interaction arguments.
     * @returns {Map<string, string>} A map containing the parsed interaction arguments.
     */
    static getInteractionArgs(customId) {
        const splitArgs = customId.split("?")[1];
        if (!splitArgs) return new Map();

        const args = splitArgs.split("&");
        const rtnMap = new Map();

        args.map((arg) => {
            const split = arg.split("=");
            rtnMap.set(split[0], split[1]);
        });

        return rtnMap;
    }
}

module.exports = Lib