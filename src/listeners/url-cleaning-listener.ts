import { Client, EmbedBuilder, Events } from "discord.js";
import getUrls from "get-urls";
import { TidyURL } from 'tidy-url';
import { IData } from "tidy-url/lib/interface.js";

TidyURL.allow_redirects = true;
TidyURL.allow_amp = false;

export function RegisterUrlCleaningListener(client: Client) {
    client.on(Events.MessageCreate, async (msg) => {
        const urls = getUrls(msg.content);

        if(urls.size === 0) {
            return;
        }

        const cleaned: IData[] = [];
        for(const url of urls) {
            const c = TidyURL.clean(url);
            if(c.info.reduction > 0) { // Was a URL actually cleaned?
                cleaned.push(c);
            }
        }

        if(cleaned.length === 0) {
            return;  // Were no URLs cleaned? No need to send a message.
        }
        
        const embed = new EmbedBuilder()
            .setTitle(`Cleaned URLs`)
            .setColor(`#8034EB`);
            
        if(cleaned.length === 1) {
            embed.setDescription(`I detected a URL in the last message sent by ${msg.author.username} (<@${msg.author.id}>) with some tracking data and cleaned it up for you.`);
        } else {
            embed.setDescription(`I detected ${cleaned.length} URLs in the last message sent by ${msg.author.username} with some tracking data and cleaned them up for you.`);
        }

        let fields = [];
        for(const url of cleaned) {
            const domainUrl = new URL(url.url);
            fields.push({
                name: domainUrl.hostname,
                value: `No Tracking - ${url.url}\nNo PayWall - https://12ft.io/${url.url}`
            });
        }

        embed.addFields(fields);

        msg.channel.send({ embeds: [embed] })
    });

    console.log("Registered UrlCleaningListener");
}
