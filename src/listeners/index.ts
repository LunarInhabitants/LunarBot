import { Client } from "discord.js";
import { RegisterUrlCleaningListener } from "./url-cleaning-listener.js";

export default function RegisterListeners(client: Client) {
    RegisterUrlCleaningListener(client);
}
