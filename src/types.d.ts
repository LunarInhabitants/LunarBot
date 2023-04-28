import type { Client, ChatInputApplicationCommandData, CommandInteraction } from "discord.js";

export interface DiscordListener {
    displayName: string;
    setup: (client: Client) => void;
} 

export interface DiscordCommand extends ChatInputApplicationCommandData  {
    execute(client: Client, interaction: CommandInteraction): void;
}