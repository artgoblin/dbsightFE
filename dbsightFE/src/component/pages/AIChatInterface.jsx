import { Bot, HelpCircle, Send } from "lucide-react";

const AIChatInterface = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header Section */}
      <div className="flex flex-col p-5 border-b border-zinc-800 bg-zinc-900">
        <h1 className="text-xl font-bold text-white">AI Chat Assistant</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Ask questions about your database in natural language
        </p>
      </div>

      {/* Main Content (Center) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        
        {/* Icon Container */}
        <div className="h-16 w-16 rounded-full bg-blue-900/20 flex items-center justify-center mb-6">
          <Bot className="h-8 w-8 text-blue-600" />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-medium text-white mb-3">
          Start a Conversation
        </h3>
        <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
          Ask questions about your database and I'll help you write SQL
          queries and analyze your data.
        </p>
      </div>

      {/* Footer / Input Section */}
      <div className="p-4 pb-6 border-t bg-zinc-900 border-zinc-800">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Ask anything about your database... (e.g., 'Show me users who signed up last month')"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md transition-colors">
             <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;