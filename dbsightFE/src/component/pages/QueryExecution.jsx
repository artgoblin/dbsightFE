import { useState, useRef } from "react";
import { Button, Tooltip } from "@mui/material";
import { Clock, Bookmark, Save, Trash2, Play, Plus } from "lucide-react";
import { useGetAllQueryCacheQuery } from "../../features/schema/queryExecutionApi";

const QueryExecution = () => {
  const { data: queryHistory } = useGetAllQueryCacheQuery();
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

  const [query, setQuery] = useState(
    "-- Write your SQL query here\nSELECT * FROM users;",
  );
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const lineCount = query.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-row h-screen bg-zinc-950 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-900 p-5 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">Query Execution</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Write and execute custom SQL queries
          </p>
        </div>

        {/* Query Tabs */}
        <div className="flex items-center border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
          <div className="flex items-center px-4 py-2 bg-zinc-800 text-white border-t-2 border-blue-500">
            <span className="text-sm font-medium">Query 1</span>
            <button className="ml-2 text-zinc-400 hover:text-white">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* SQL Editor Area */}
        <div className="flex-1 min-h-0">
          <div className="h-[90%] bg-zinc-900 border border-zinc-800 rounded-md m-4 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                SQL Editor
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition">
                  <Save size={16} />
                  Save
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition"
                  onClick={() => setQuery("")}
                >
                  <Trash2 size={16} />
                  Clear
                </button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#108039ff",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    "&:hover": {
                      backgroundColor: "#22c55e",
                    },
                  }}
                >
                  <Play size={16} className="mr-2" />
                  Execute
                </Button>
              </div>
            </div>

            {/* Editor with Line Numbers */}
            <div className="flex h-full font-mono text-sm overflow-hidden">
              {/* Line Numbers Gutter */}
              <div
                ref={lineNumbersRef}
                className="w-12 bg-zinc-950 border-r border-zinc-800 text-zinc-600 text-right select-none overflow-hidden"
              >
                <div className="py-4">
                    {lineNumbers.map((n) => (
                      <div
                        key={n}
                        style={{
                          height: `20px`,
                          lineHeight: `20px`,
                        }}
                        className="px-3 text-xs"
                      >
                        {n}
                      </div>
                    ))}
                </div>
              </div>

              {/* Editable Area */}
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onScroll={handleScroll}
                className="flex-1 w-full h-full bg-transparent text-zinc-100 outline-none resize-none overflow-auto custom-scrollbar"
                style={{
                  paddingLeft: "10px",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                  lineHeight: `20px`,
                  fontSize: "14px",
                }}
                spellCheck={false}
                placeholder="-- Write your SQL query here..."
              />
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 bg-zinc-950 border-t border-zinc-800 overflow-auto">
          <div className="h-full flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <Play size={48} className="mx-auto mb-3 opacity-50" />
              <p>Execute a query to see results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-60 border-l border-zinc-800 bg-zinc-900 flex flex-col min-h-0">
        {/* Query History Section - Independent Scroll */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Clock size={18} />
              <h2>Query History</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {queryHistory?.map((item, indx) => (
              <div
                key={indx}
                className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 cursor-pointer transition"
              >
                <p className="text-sm text-zinc-300 font-mono truncate">
                  <Tooltip title={item}>{item}</Tooltip>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Queries Section - Independent Scroll */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
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
