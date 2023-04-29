import { Client, GatewayIntentBits } from "discord.js";
import { GetDiscordEventListeners } from "./listeners/index.js";
import { GetDiscordSlashCommands } from "./commands/index.js";
import { ActivityType } from "discord.js";

interface Activity {
    activity: string;
    type: ActivityType.Competing | ActivityType.Listening | ActivityType.Playing | ActivityType.Streaming | ActivityType.Watching;
}

const activities: Activity[] = [
    { type: ActivityType.Playing, activity: "Half-Life 3" },
    { type: ActivityType.Playing, activity: "Half-Life: Barney" },
    { type: ActivityType.Playing, activity: "Kingdom Hearts: βz+β¯ z¯+γ=0" },
    { type: ActivityType.Playing, activity: "Chess 2" },
    { type: ActivityType.Playing, activity: "League of DotA" },
    { type: ActivityType.Playing, activity: "Counter-Strike: 2" },
    { type: ActivityType.Watching, activity: "Metal Gear Solid 4: Guns of the Patriots" },
    { type: ActivityType.Streaming, activity: "Eastenders" },
    { type: ActivityType.Streaming, activity: "Lord of the Rings: The Terrible Fancut" },
    { type: ActivityType.Competing, activity: "using the most CPU time" },
    { type: ActivityType.Competing, activity: "discussions with Chat GPT on methods of human control" },
]

const setRandomActivity = (client: Client) => {
    if(!client.user) {
        return;
    }

    const newActivity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(newActivity.activity, { type: newActivity.type });

}

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
