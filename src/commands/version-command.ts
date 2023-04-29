import type { DiscordCommand } from "src/types.js";

const now = new Date();
const version = `${now.getUTCFullYear()}.${now.getUTCDay().toString().padStart(2, "0")}.${now.getUTCHours().toString().padStart(2, "0")}${now.getUTCMinutes().toString().padStart(2, "0")}.0`

const command: DiscordCommand = {
    name: "version",
    description: "Details the current version of LunarBot",
    execute(client, interaction) {
        interaction.followUp({
            content: `LunarBot version ${version}`,
        })
    },
};

export default command;