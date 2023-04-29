import type { DiscordCommand } from "src/types.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cachedCommands: DiscordCommand[] = [];

export const GetDiscordSlashCommands = async (): Promise<DiscordCommand[]> => {
    if(cachedCommands.length > 0) {
        return cachedCommands;
    }

    const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.ts') && file !== "index.ts");

    for(const file of commandFiles) {
        const filePath = `./${file}`;
        const command: DiscordCommand = (await import(filePath)).default;

        if("name" in command && "description" in command && "execute" in command) {
            cachedCommands.push(command);
        } else {
            console.warn(`Could not load Discord Slash Command from file '${file}'`);
        }
    }

    return cachedCommands;
};
