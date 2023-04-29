import { Client, GatewayIntentBits } from "discord.js";
import { GetDiscordEventListeners } from "./listeners/index.js";
import { GetDiscordSlashCommands } from "./commands/index.js";
import { setRandomActivity } from "./misc/silly-activities.js";

export default async function RunLunarBot() {
    if (!process.env.DISCORD_TOKEN) {
        throw new Error("Discord token has not been defined. Have you specified DISCORD_TOKEN in .env or your hosts environment variables?");
    }

    console.log("LunarBot is starting...");

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ]
    });

    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        const commandList = await GetDiscordSlashCommands();
        console.log(`Registering ${commandList.length} Discord Slash Commands...`);
        for(const cmd of commandList) {
            console.log(` • /${cmd.name} - ${cmd.description}`);
        }
        await client.application.commands.set(commandList);
        console.log(`Registered Discord Slash Commands.`);

        setTimeout(() => setRandomActivity(client), 5 * 60 * 1000);
        setRandomActivity(client);

        console.log(`LunarBot with name '${client.user.username}' is online.`);
    });

    const listeners = await GetDiscordEventListeners();
    console.log(`Registering ${listeners.length} Discord Event Listeners...`);
    for (const listener of listeners) {
        console.log(` • ${listener.displayName}`);
        listener.setup(client);
    }
    console.log(`Registered Discord Event Listeners.`);

    client.login(process.env.DISCORD_TOKEN);
}
