import { Clock, Bookmark, Save, Trash2, Play, Plus } from "lucide-react";

const QueryExecution = () => {
  const queryHistory = [
    {
      id: 1,
      query: "SELECT * FROM users WHERE created_at > '2024-01-01'",
      time: "2 minutes ago",
    },
    {
      id: 2,
      query: "SELECT product_name, SUM(quantity) FROM orders...",
      time: "15 minutes ago",
    },
    {
      id: 3,
      query: "SELECT c.name, COUNT(o.id) FROM customers c...",
      time: "1 hour ago",
    },
    {
      id: 4,
      query: "SELECT * FROM products WHERE price > 100",
      time: "2 hours ago",
    },
    {
      id: 5,
      query: "UPDATE users SET status = 'inactive' WHERE...",
      time: "3 hours ago",
    },
    {
      id: 6,
      query: "DELETE FROM temp_data WHERE created_at <...",
      time: "5 hours ago",
    },
  ];

  const savedQueries = [
    {
      id: 1,
      title: "Active Users Report",
      query: "SELECT * FROM users WHERE status = 'active'",
      tags: ["users", "reports"],
    },
    {
      id: 2,
      title: "Monthly Sales Summary",
      query: "SELECT DATE_TRUNC('month', order_date) as mo...",
      tags: ["sales", "analytics"],
    },
    {
      id: 3,
      title: "Customer Lifetime Value",
      query: "SELECT customer_id, SUM(total_amount)...",
      tags: ["customers", "analytics"],
    },
    {
      id: 4,
      title: "Product Performance",
      query: "SELECT p.name, COUNT(o.id) as orders...",
      tags: ["products", "analytics"],
    },
    {
      id: 5,
      title: "Daily Revenue",
      query: "SELECT DATE(order_date), SUM(amount)...",
      tags: ["sales", "daily"],
    },
    {
      id: 6,
      title: "User Registration Trends",
      query: "SELECT DATE(created_at), COUNT(*)...",
      tags: ["users", "trends"],
    },
  ];

  return (
    <div className="flex flex-row h-screen bg-zinc-950">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-900 p-5">
          <h1 className="text-xl font-bold text-white">Query Execution</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Write and execute custom SQL queries
          </p>
        </div>

        {/* Query Tabs */}
        <div className="flex items-center border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center px-4 py-2 bg-zinc-800 text-white border-t-2 border-blue-500">
            <span className="text-sm font-medium">Query 1</span>
            <button className="ml-2 text-zinc-400 hover:text-white">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* SQL Editor Toolbar */}

        {/* SQL Editor */}

        <div className="p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between px-4 py-2 border rounded-lg border-zinc-800 bg-zinc-900/10">
              <span className="text-sm text-zinc-400">SQL Editor</span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition">
                  <Save size={16} />
                  Save
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition">
                  <Trash2 size={16} />
                  Clear
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded transition">
                  <Play size={16} />
                  Execute
                </button>
              </div>
            </div>
            <textarea
              data-slot="textarea"
              className="resize-none flex w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-base text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-800 focus-visible:border-zinc-800 md:text-sm font-mono min-h-[150px]"
            />
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 flex items-center justify-center bg-zinc-950">
          <div className="text-center text-zinc-500">
            <Play size={48} className="mx-auto mb-3 opacity-50" />
            <p>Execute a query to see results</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-60 border-l border-zinc-800 bg-zinc-900 flex flex-col">
        {/* Query History Section - Independent Scroll */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-zinc-800">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Clock size={18} />
              <h2>Query History</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {queryHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 cursor-pointer transition"
              >
                <p className="text-sm text-zinc-300 font-mono truncate">
                  {item.query}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Queries Section - Independent Scroll */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Bookmark size={18} />
              <h2>Saved Queries</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {savedQueries.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 cursor-pointer transition"
              >
                <h3 className="text-sm font-medium text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 font-mono truncate mb-3">
                  {item.query}
                </p>
                <div className="flex gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryExecution;
