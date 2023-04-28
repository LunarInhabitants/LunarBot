import type { DiscordCommand } from "src/types.js";
import { VersionCommand } from "./version-command.js";

export const CommandList: DiscordCommand[] = [
    VersionCommand
];