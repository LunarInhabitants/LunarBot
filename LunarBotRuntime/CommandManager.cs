using Discord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace LunarBotRuntime
{
    public static class CommandManager
    {
        public static List<DiscordCommand> commands { get; private set; } = new List<DiscordCommand>();

        public static DiscordCommand AddCommand(string commandName, Func<DiscordCommandArguments, Task> commandAction)
        {
            if (commandName == null || commandName.Length == 0 || commandAction == null)
                return null;

            DiscordCommand cmd = new DiscordCommand(commandName, commandAction);
            commands.Add(cmd);
            return cmd;
        }

        internal static void SetupCoreCommands()
        {
            CommandManager.AddCommand("forcereload", async (e) =>
            {
                DiscordBotRuntime.Reload();
                await e.Channel.SendMessage($"Bot reloaded by {e.User.Mention}");
            })
                .SetHelpString("Reloads all plugins and commands");

            CommandManager.AddCommand("help", CmdPrintHelp)
                .AddAliases("?")
                .AddArgument("page", true)
                .SetHelpString("Lists this help text");

            CommandManager.AddCommand("plugins", CmdPrintPlugins)
                .SetHelpString("Lists all plugins");

            CommandManager.AddCommand("blep", async (e) =>
            {
                //await e.Channel.SendMessage($"Get blepped {e.User.Mention}");
                await e.Channel.SendTTSMessage($"<rate absspeed=\"-3\"/><pitch absmiddle=\"-3\"/><lang langid=\"409\"><emph>Gong</emph></lang>");
                //await e.Channel.SendTTSMessage($"Gong");
            })
                .AddAliases("bleep", "blempo", "blongi")
                .SetHelpString("You just got blepped son");


            CommandManager.AddCommand("addrtcommand", CmdAddRTCommand)
                .AddAliases("addrtcmd")
                .AddArgument("command", false)
                .AddArgument("code", false, true)
                .SetHelpString("Add a command directly from Discord! Must be C# code.");

            CommandManager.AddCommand("math", CmdMath)
                .AddAliases("calc")
                .AddArgument("math", false, true)
                .SetHelpString(@"Calculates a mathematical expression");
        }

        public static async Task AttemptToRunCommand(MessageEventArgs e)
        {
            string commandLine = e.Message.Text.Substring(1);

            List<string> cmdParts = Regex.Matches(commandLine, @"[\""].+?[\""]|[^ \n]+")
                .Cast<Match>()
                .Select(m => m.Value)
                .ToList();

            DiscordCommand cmd = commands.Find(c => c.HasCommandName(cmdParts[0]));

            if (cmd != null)
            {
                Console.WriteLine($"{e.Message.User.Name} ran command '{cmdParts[0]}'");

                await cmd.Execute(e, cmdParts);
                return;
            }

            Console.WriteLine($"{e.Message.User.Name} attempted to run command '{cmdParts[0]}' (Command not found)");
            await e.Channel.SendMessage(e.Message.User.Mention + " - Sorry, but that command was not found");
        }

        #region Core Commands
        private static async Task CmdPrintHelp(DiscordCommandArguments args)
        {
            StringBuilder sb = new StringBuilder();

            int page = 1;
            int maxPageCount = CommandManager.commands.Count / 10 + 1;

            if (args["page"] != null && !int.TryParse(args["page"], out page))
            {
                sb.AppendLine($"**{args["page"]}** is not a number!");
            }
            else if (page < 1)
            {
                sb.AppendLine($"Cannot show page **{page}** of help - Pages start at **1**!");
            }
            else if (page * 10 > CommandManager.commands.Count + 10)
            {
                sb.AppendLine($"Cannot show page **{page}** of help - There are only **{maxPageCount}** pages!");
            }
            else
            {
                sb.AppendLine($"**Help:** Showing page **{page}** out of **{maxPageCount}**");
                sb.AppendLine();

                --page;

                for (int i = page * 10; i < (page + 1) * 10 && i < CommandManager.commands.Count; ++i)
                {
                    sb.AppendLine(CommandManager.commands[i].GetHelpString());
                }
            }

            await args.Channel.SendMessage(sb.ToString());
        }

        private static async Task CmdPrintPlugins(DiscordCommandArguments args)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine($"**Plugins:**");
            sb.AppendLine();

            foreach (LunarBotPlugin plugin in PluginManager.Plugins)
            {
                sb.AppendLine(plugin.GetPluginDescription());
            }

            await args.Channel.SendMessage(sb.ToString());
        }

        private static async Task CmdAddRTCommand(DiscordCommandArguments args)
        {
            string commandName = args["command"].ToLower();
            string codeContent = args["code"];

            if (CommandManager.commands.Find(c => c.HasCommandName(commandName)) != null)
            {
                await args.Channel.SendMessage($"{args.User.Mention} - Sorry, but the command {commandName} already exists!");
                return;
            }

            MethodInfo mi = await RuntimeCommandCompiler.CompileInputCode(args, codeContent);

            if (mi != null)
            {
                CommandManager.AddCommand(commandName, async e2 =>
                {
                    mi.Invoke(null, new object[] { e2 });
                }).SetHelpString("[Runtime defined method]");
            }
        }

        private static async Task CmdMath(DiscordCommandArguments args)
        {
            string math = args["math"];

            org.mariuszgromada.math.mxparser.Expression expr = new org.mariuszgromada.math.mxparser.Expression(math);
            StringBuilder sb = new StringBuilder();
            if (!expr.checkSyntax())
            {
                sb.AppendLine($"{args.User.Mention} - Error in mathematical expression:");
                sb.AppendLine(expr.getErrorMessage());
            }
            else
            {
                sb.AppendLine($"{args.User.Mention} - {math} = **{expr.calculate()}**");
            }
            await args.Channel.SendMessage(sb.ToString());
        }
        #endregion
    }
}
