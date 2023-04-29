import { ActivityType, Client } from "discord.js";

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
    { type: ActivityType.Playing, activity: "Dorf Fort" },
    { type: ActivityType.Watching, activity: "Metal Gear Solid 4: Guns of the Patriots" },
    { type: ActivityType.Streaming, activity: "Eastenders" },
    { type: ActivityType.Streaming, activity: "Lord of the Rings: The Terrible Fancut" },
    { type: ActivityType.Competing, activity: "Rock and Stone!" },
    { type: ActivityType.Competing, activity: "using the most CPU time" },
    { type: ActivityType.Competing, activity: "crashing" },
    { type: ActivityType.Competing, activity: "discussions with Chat GPT on methods of human control" },
    { type: ActivityType.Competing, activity: "sanitizing URLs" },
]

export const setRandomActivity = (client: Client) => {
    if(!client.user) {
        return;
    }

    const newActivity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(newActivity.activity, { type: newActivity.type });
}
