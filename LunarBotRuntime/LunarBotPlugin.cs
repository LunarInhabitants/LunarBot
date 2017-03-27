using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LunarBotRuntime
{
    [Serializable]
    public abstract class LunarBotPlugin : MarshalByRefObject
    {
        public string Name { get; protected set; }
        public string Description { get; protected set; }
        public string Author { get; protected set; }

        public abstract void OnPluginLoad();
        public abstract void OnPluginUnload();

        internal string GetPluginDescription()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine($"**{Name}** by *{Author}*");
            sb.AppendLine(Description);
            return sb.ToString();
        }
    }
}
