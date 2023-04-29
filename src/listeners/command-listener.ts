import type { DiscordEventListener } from "src/types.js";
import { Client, Events } from "discord.js";
import { GetDiscordSlashCommands } from "../commands/index.js";

const listener: DiscordEventListener = {
    displayName: "Slash Command Handler",
    setup: (client: Client) => {
        client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isCommand() || interaction.isContextMenuCommand()) {
                const commandList = await GetDiscordSlashCommands();
                const cmd = commandList.find(c => c.name === interaction.commandName);

                if (!cmd) {
                    interaction.followUp({
                        content: `An error occurred trying to run command ${interaction.commandName}`,
                    });
                    return;
                }

                await interaction.deferReply(); // Give our command time if it does anything long running.

                cmd.execute(client, interaction);
            }
        });
    }
};

export default listener;
