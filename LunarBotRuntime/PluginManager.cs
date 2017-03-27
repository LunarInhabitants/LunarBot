using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace LunarBotRuntime
{
    public static class PluginManager
    {
        internal static List<LunarBotPlugin> Plugins { get; private set; } = new List<LunarBotPlugin>();
        private static List<AppDomain> pluginAppDomains = new List<AppDomain>();

        public static void LoadPlugins()
        {
            foreach (string dll in Directory.GetFiles("plugins", "*.dll"))
            {
                Assembly a = Assembly.LoadFrom(dll);

                foreach (Type t in a.GetTypes().Where(t => t.IsSubclassOf(typeof(LunarBotPlugin))))
                {
                    LunarBotPlugin plugin = (LunarBotPlugin)Activator.CreateInstance(t);
                    plugin.OnPluginLoad();
                    Plugins.Add(plugin);

                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine($"Loaded plugin {plugin.Name} by {plugin.Author}");
                    Console.ForegroundColor = ConsoleColor.White;
                }
            }
        }
    }
}
