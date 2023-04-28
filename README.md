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

With that in place, and back in your console, now run `pnpm start` and your bot should come alive!
