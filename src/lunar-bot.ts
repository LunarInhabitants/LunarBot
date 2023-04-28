import { Client, GatewayIntentBits } from "discord.js";
import RegisterListeners from "./listeners/index.js";

export default function RunLunarBot() {
    if(!process.env.DISCORD_TOKEN) {
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

        console.log(`${client.user.username} is online`);
    });

    RegisterListeners(client);

    client.login(process.env.DISCORD_TOKEN);
}
