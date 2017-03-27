using Discord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LunarBotRuntime
{
    [Serializable]
    public class DiscordCommand : MarshalByRefObject
    {
        public class CommandArgument
        {
            public string argName;
            public bool isOptional;
            public bool includesRemainder;

            internal CommandArgument(string name, bool optional, bool isRemainder)
            {
                argName = name;
                isOptional = optional;
                includesRemainder = isRemainder;
            }
        }

        public string PrimaryName { get; internal set; }
        private Func<DiscordCommandArguments, Task> Action { get; set; }
        public List<string> Aliases { get; internal set; } = new List<string>();
        public List<CommandArgument> Arguments { get; internal set; } = new List<CommandArgument>();
        public string HelpString { get; internal set; } = " ";

        internal DiscordCommand(string primaryName, Func<DiscordCommandArguments, Task> cmdAction)
        {
            PrimaryName = primaryName.ToLower();
            Action = cmdAction;
        }

        public DiscordCommand AddAliases(params string[] newAliases)
        {
            foreach (string str in newAliases)
                Aliases.Add(str.ToLower());

            return this;
        }

        public DiscordCommand AddArgument(string argName, bool isOptional, bool isRemainder = false)
        {
            if (Arguments.Count > 0 && Arguments.Last().includesRemainder)
            {
                throw new ArgumentException("The previously specified argument includes the remainder of the input. No other arguments can appear after this.");
            }
            else if (!isOptional && Arguments.Count > 0 && Arguments.Last().isOptional)
            {
                throw new ArgumentException("isOptional is false, but the current last command is optional. All optional commands must appear after all none optional commands.");
            }

            Arguments.Add(new CommandArgument(argName.ToLower(), isOptional, isRemainder));

            return this;
        }

        public DiscordCommand SetHelpString(string helpString)
        {
            HelpString = helpString;
            return this;
        }

        public bool HasCommandName(string testName)
        {
            testName = testName.ToLower();
            return PrimaryName == testName || Aliases.Contains(testName);
        }

        public string GetHelpString()
        {
            StringBuilder sb = new StringBuilder();

            sb.Append($"**!{PrimaryName}**");
            foreach (CommandArgument arg in Arguments)
                sb.Append($" {(arg.isOptional ? "*[" : "<")}{arg.argName}{(arg.includesRemainder ? "..." : "")}{(arg.isOptional ? "]*" : ">")}");
            sb.AppendLine();

            if (Aliases.Count > 0)
            {
                sb.Append("Aliases:");
                bool isFirst = true;
                foreach (string alias in Aliases)
                {
                    sb.Append($"{(isFirst ? "" : ", ")}**{alias}**");
                    isFirst = false;
                }
                sb.AppendLine();
            }

            sb.AppendLine($"*{HelpString}*");
            return sb.ToString();
        }

        public async Task Execute(MessageEventArgs e, List<string> args)
        {
            DiscordCommandArguments argsProper = new DiscordCommandArguments();
            argsProper.Channel = e.Channel;
            argsProper.Message = e.Message;
            argsProper.Server = e.Server;
            argsProper.User = e.User;

            argsProper["_command"] = args[0];

            string arg;
            for (int i = 0; i < Arguments.Count; ++i)
            {
                arg = i + 1 < args.Count ? args[i + 1] : null;
                if (arg == null && !Arguments[i].isOptional)
                {
                    await e.Channel.SendMessage($"{e.Message.User.Mention} - Sorry, but that command was missing the required parameter '{Arguments[i].argName}'");
                    return;
                }
                if (Arguments[i].includesRemainder)
                {
                    for (int j = i + 2; j < args.Count; ++j)
                        arg += " " + args[j];
                }
                argsProper[Arguments[i].argName] = arg;
            }

            try
            {
                await Action(argsProper);
            }
            catch (Exception ex)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine($"{e.Message.User.Mention} - Sorry, but an exception occurred while running that command. The exception is as follows:");
                sb.AppendLine();
                sb.AppendLine(ex.ToString());
                await e.Channel.SendMessage(sb.ToString());
            }
        }
    }

    public class DiscordCommandArguments : Dictionary<string, string>
    {
        public Channel Channel;
        public Message Message;
        public Server Server;
        public User User;
    }
}
