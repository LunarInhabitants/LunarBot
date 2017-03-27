using Discord;
using Microsoft.CSharp;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace LunarBotRuntime
{
    class RuntimeCommandCompiler
    {
        public static async Task<MethodInfo> CompileInputCode(DiscordCommandArguments e, string codeContent)
        {
            string code = @"
using Discord;
using System;
using LunarBotRuntime;

public class InlineCommand
{
    static Channel channel;
    static User user;
    static Message message;
    static Server server;

    public static void _runtimeInvoke(MessageEventArgs messageArgs, DiscordCommandArguments args)
    {
        channel = messageArgs.Channel;
        user = messageArgs.User;
        message = messageArgs.Message;
        server = messageArgs.Server;
        " + codeContent + @"
    }
}
";
            CSharpCodeProvider provider = new CSharpCodeProvider();
            CompilerParameters parameters = new CompilerParameters();
            parameters.GenerateInMemory = true;
            parameters.GenerateExecutable = false;
            parameters.ReferencedAssemblies.AddRange(new string[] {
                "LunarBotRuntime.exe",
                "Discord.Net.dll",
                "Newtonsoft.Json.dll",
                "Nito.AsyncEx.dll",
                "Nito.AsyncEx.Concurrent.dll",
                "Nito.AsyncEx.Enlightenment.dll",
                "RestSharp.dll",
                "WebSocket4Net.dll",
            });
            CompilerResults results = provider.CompileAssemblyFromSource(parameters, code);

            if (results.Errors.HasErrors)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine($"{e.User.Mention} - Compilation failed! Code had the following errors:");
                sb.AppendLine();

                foreach (CompilerError error in results.Errors)
                {
                    sb.AppendLine($"Error ({error.ErrorNumber} @ {error.Line}): {error.ErrorText}");
                }

                await e.Channel.SendMessage(sb.ToString());
                return null;
            }

            Assembly assembly = results.CompiledAssembly;
            Type program = assembly.GetType("InlineCommand");
            return program.GetMethod("_runtimeInvoke");
        }
    }
}
