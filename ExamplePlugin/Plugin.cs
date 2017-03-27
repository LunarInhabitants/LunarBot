using Discord;
using LunarBotRuntime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

[Serializable]
public class Example : LunarBotPlugin
{
    public Example()
    {
        Name = "Test Plugin that was reloaded";
        Description = "This is a test of the plugin system";
        Author = "Daniel Masterson";
    }

    public override void OnPluginLoad()
    {
        CommandManager.AddCommand("plugintest", async (e) =>
        {
            e.Channel.SendMessage("This plugin dun did werk and was reloaded");
        });
    }

    public override void OnPluginUnload()
    {
    }
}
