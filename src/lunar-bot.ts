import { Client, GatewayIntentBits } from "discord.js";
import { Listeners } from "./listeners/index.js";
import { CommandList } from "./commands/index.js";
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
    { type: ActivityType.Competing, activity: "in using the most CPU time" },
    { type: ActivityType.Competing, activity: "with Chat GPT on methods of human control" },
]

const setRandomActivity = (client: Client) => {
    if(!client.user) {
        return;
    }

    const newActivity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(newActivity.activity, { type: newActivity.type });

}

export default function RunLunarBot() {
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

        console.log(`Registering ${CommandList.length} slash commands...`);
        await client.application.commands.set(CommandList);

        setTimeout(() => setRandomActivity(client), 5 * 60 * 1000);
        setRandomActivity(client);

        console.log(`${client.user.username} is online`);
    });

    for (const listener of Listeners) {
        console.log(`Registering event listener - ${listener.displayName}`);
        listener.setup(client);
    }

    client.login(process.env.DISCORD_TOKEN);
}
