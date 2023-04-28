import type { DiscordListener } from "src/types.js";
import { Client, Events } from "discord.js";
import { CommandList } from "../commands/index.js";

export const CommandListener: DiscordListener = {
    displayName: "Slash Command Handler",
    setup: (client: Client) => {
        client.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isCommand() || interaction.isContextMenuCommand()) {
                const cmd = CommandList.find(c => c.name === interaction.commandName);

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
