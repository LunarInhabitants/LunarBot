using Discord;
using LunarBotRuntime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class Example : LunarBotPlugin
{
    public Example()
    {
        Name = "Test Plugin";
        Description = "This is a test of the plugin system";
        Author = "Daniel Masterson";
    }

    public override void OnPluginLoad()
    {
        CommandManager.AddCommand("plugintest", async (e) =>
        {
            await e.Channel.SendMessage("This plugin works!");
        });
    }

    public override void OnPluginUnload()
    {
    }
}
