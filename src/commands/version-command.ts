import type { DiscordCommand } from "src/types.js";

const now = new Date();
const version = `${now.getUTCFullYear()}.${now.getUTCDay().toString().padStart(2, "0")}.${now.getUTCHours().toString().padStart(2, "0")}${now.getUTCMinutes().toString().padStart(2, "0")}.0`

const command: DiscordCommand = {
    name: "version",
    description: "Details the current version of LunarBot",
    execute(client, interaction) {
        let content = `LunarBot version ${version}`;

        // If hosted on Railway.App
        if(process.env.RAILWAY_GIT_AUTHOR && process.env.RAILWAY_GIT_COMMIT_MESSAGE) {
            content += `\nThis build was triggered by *${process.env.RAILWAY_GIT_AUTHOR}* with the commit message:\n*${process.env.RAILWAY_GIT_COMMIT_MESSAGE}*`
        }

        interaction.followUp({ content })
    },
};

export default command;