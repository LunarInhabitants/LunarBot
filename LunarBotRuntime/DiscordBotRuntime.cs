using Discord;
using Microsoft.CSharp;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace LunarBotRuntime
{
    public static class DiscordBotRuntime
    {
        public static DiscordClient discordClient { get; private set; }
        static bool isRunning = true;

        static void Main(string[] args)
        {
            Console.CancelKeyPress += (s, e) => Shutdown();

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine(" LunarBot |");
            Console.WriteLine("===========");
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.White;

            CommandManager.SetupCoreCommands();
            PluginManager.LoadPlugins();
            Console.WriteLine();

            Console.WriteLine("Loaded commands: ");
            Console.ForegroundColor = ConsoleColor.Yellow;
            foreach (DiscordCommand cmd in CommandManager.commands)
            {
                Console.WriteLine($"• !{cmd.PrimaryName}");
            }
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.White;

            discordClient = new DiscordClient();
            discordClient.MessageReceived += OnMessageReceived;

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("Connecting to Discord");
            Console.ForegroundColor = ConsoleColor.White;
            discordClient.Connect("Mjk1NjE1MDU3MjM1MTQ4ODAx.C7mQhA.e7c2oTbiP3NNkZI9fml1-a4zNR4", TokenType.Bot);
            while (discordClient.State == ConnectionState.Connecting)
                Thread.Sleep(50);
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("Connected to Discord");
            Console.ForegroundColor = ConsoleColor.White;

            while (isRunning)
                Thread.Sleep(50);
            Shutdown();
        }

        static void Shutdown()
        {
            if(discordClient != null)
                discordClient.Disconnect();
        }

        private static async void OnMessageReceived(object sender, MessageEventArgs e)
        {
            if (e.Message.IsAuthor)
                return;

            if (e.Message.Text[0] == '!' && e.Message.Text.Length > 1)
            {
                await CommandManager.AttemptToRunCommand(e);
            }
        }

        internal static void Reload()
        {
            System.Diagnostics.Process.Start(Environment.CurrentDirectory + "\\LunarBotRuntime.exe");
            isRunning = false;
        }
    }
}
