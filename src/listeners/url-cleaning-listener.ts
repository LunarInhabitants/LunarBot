import type { DiscordEventListener } from "src/types.js";
import { APIEmbedField, Client, EmbedBuilder, Events, GuildMember, Message } from "discord.js";
import getUrls from "get-urls";
import { TidyURL } from 'tidy-url';
import { IData as CleanedUrlData } from "tidy-url/lib/interface.js";

TidyURL.allow_redirects = true;
TidyURL.allow_amp = false;

const urlsAreEqual = (a: URL, b: URL) => {
    let aHost = a.host;
    if(aHost.startsWith("www.")) {
        aHost = aHost.slice(4);
    }
    let bHost = b.host;
    if(bHost.startsWith("www.")) {
        bHost = bHost.slice(4);
    }

    let aPathName = a.pathname;
    if(aPathName[aPathName.length - 1] !== '/') {
        aPathName += "/";
    }
    let bPathName = b.pathname;
    if(bPathName[bPathName.length - 1] !== '/') {
        bPathName += "/";
    }

    return aHost === bHost
        && aPathName === bPathName
        && a.search === b.search;
}

const listener: DiscordEventListener = {
    displayName: "URL Cleaner",
    setup: (client: Client) => {
        client.on(Events.MessageCreate, async (msg) => {
            const dirtyUrls = [...getUrls(msg.content)];

            if (dirtyUrls.length === 0) {
                return; // No URLs in message?
            }

            const cleanedUrls: CleanedUrlData[] = [];
            for (const url of dirtyUrls) {
                const c = TidyURL.clean(url);
                if (c.info.reduction > 0) { // Was a URL actually cleaned?
                    cleanedUrls.push(c);
                }
            }

            if (cleanedUrls.length === 0) {
                return;  // Were no URLs cleaned? No need to send a message.
            }

            let guildMember: GuildMember | null = null;
            if (msg.guild) {
                guildMember = await msg.guild.members.fetch(msg.author);
            }

            const embed = await createEmbed(msg, guildMember, dirtyUrls, cleanedUrls);
            msg.channel.send({ embeds: [embed] })
        });
    }
};

async function createEmbed(msg: Message<boolean>,guildMember: GuildMember | null,  dirtyUrls: string[], cleanedUrls: CleanedUrlData[]) {
    const embed = new EmbedBuilder()
        .setTitle(`Cleaned URLs`)
        .setColor(guildMember?.displayColor ?? `#8034EB`)
        .setAuthor({
            name: guildMember?.nickname ?? msg.author.username,
            iconURL: msg.author.avatarURL() ?? undefined,
        });

    let msgWasDeleted = false;
    if (dirtyUrls.length === 1) {
        try {
            const beforeUrl = new URL(dirtyUrls[0]);
            const afterUrl = new URL(msg.content.trim()); // Throws if the message isn't a bare URL

            if (urlsAreEqual(beforeUrl, afterUrl)) {
                // The message was just a URL, with no extra content?
                await msg.delete();
                msgWasDeleted = true;
                embed.setTitle(null);
            }
        } catch (err) {
            // Intentionally ignored.
        }
    }

    if (msgWasDeleted) {
        embed.setDescription(`<@${msg.author.id}> sent a URL with some tracking data. Here is the cleaned up URL:`);
    } else if (cleanedUrls.length === 1) {
        embed.setDescription(`I detected a URL in the last message sent by <@${msg.author.id}> with some tracking data and cleaned it up for you:`);
    } else {
        embed.setDescription(`I detected ${cleanedUrls.length} URLs in the last message sent by <@${msg.author.id}> with some tracking data and cleaned them up for you:`);
    }

    let fields: APIEmbedField[] = [];
    for (const url of cleanedUrls) {
        const domainUrl = new URL(url.url);
        fields.push({
            name: domainUrl.hostname,
            value: `No Tracking - ${url.url}\nNo PayWall - https://12ft.io/${url.url}`
        });
    }

    embed.addFields(fields);
    return embed;
}

export default listener;
