import type { DiscordListener } from "src/types.js";
import { UrlCleaningListener } from "./url-cleaning-listener.js";
import { CommandListener } from "./command-listener.js";

export const Listeners: DiscordListener[] = [
    CommandListener,
    UrlCleaningListener
];
