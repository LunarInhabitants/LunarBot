import type { DiscordEventListener } from "src/types.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GetDiscordEventListeners = async (): Promise<DiscordEventListener[]> => {
    const listeners: DiscordEventListener[] = [];
    const listenerFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.ts') && file !== "index.ts");

    for(const file of listenerFiles) {
        const filePath = `./${file}`;
        const listener: DiscordEventListener = (await import(filePath)).default;

        if("displayName" in listener && "setup" in listener) {
            listeners.push(listener);
        } else {
            console.warn(`Could not load Discord Event Listener from file '${file}'`);
        }
    }

    return listeners;
};
