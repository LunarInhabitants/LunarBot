# LunarBot

LunarBot is a Discord bot developed by the [Lunar Inhabitants](https://github.com/LunarInhabitants/). It aims to provide niché functionality specific to the requirements of the Lunar Inhabitants, but feel free to clone and host a copy yourself.

## Features

LunarBot includes a number of features. These include

* Url Cleaner - Automatic tracking removal of links posted to any channel the bot has access to.

## How to Get Started

By default, LunarBot is developed with [PNPM](https://pnpm.io/) in mind, although using NPM or Yarn should be more than possible too. If you've never used PNPM before, you can enable it by using

```
corepack enable
corepack prepare pnpm@latest --activate
```

Once done, clone this repository, then navigate a command line to the target directory root (Where package.json is) and run `pnpm install`.

Once the packages have installed, you'll need to create a new .env file alongside the package.json. This is what provides the tokens necessary for the bot to connect to Discord, as well as other general settings. You can use .env.example as an example containing all required and optional env tokens.

To get a Discord token for a testing bot, navigate to [The Discord Developer Portal](https://discord.com/developers/applications) and register a new application. In the bot tab of your created Discord app, you can grab/reset a token from there (Be sure to copy it then and there, or else it'll be gone forever and you'll have to reset again!), then add it to your .env file. On the bot page, also be sure to tick all three `Priveleged Gateway Intents' options so the bot can actually function. Finally, navigate to 'OAuth2 -> URL Generator', tick 'applications.commands' (Middle column) and 'bot' (Right column), and then in the Bot Permissions window below, tick 'Administrator'. Now copy the URL at the bottom and visit it to add the bot to your personal Discord server that you'll use for testing.

With that in place, and back in your console, now run `pnpm start` and your bot should come alive!

For Lunar Inhabitants members - If you make any changes and check them into the main branch of this GitHub repository, the LunarBot instance in the Lunar Inhabitants server will be automatically redeployed.

## Adding a Slash Command

Navigate to src/commands and duplicate an existing command file there. Change `name`, `description` and `execute` to suit your new command, and add any other required properties you may require as part of the `DiscordCommand` type. The object *must*  be the default export in the file to be detected. You don't need to touch any other file - your command's file will be automatically detected and dynamically loaded when LunarBot starts up.


## Adding an Event Listner

Event listeners react to server events, unlike slash commands. This could include things such when a message is received or a reaction is applied to a message. Like commands above, all you need to do is create a new file in the src/listeners directory which default exports an object containing a `displayName` string, and a `setup` function that takes in a Discord `Client` as its only parameter. You don't need to fiddle around with any other files, your new file will be detected and dynamically loaded when LuanrBot starts up.
