import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router";
import { Bot, Send, User, Copy, Trash2 } from "lucide-react";
import { useFetchQueryResponseMutation } from "../../features/schema/agentApi";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

const transformResultToGrid = (data) => {
  if (!data || data.length === 0) return { rows: [], cols: [] };

  // Create columns dynamically from object keys
  const cols = Object.keys(data[0]).map((key) => ({
    field: key,
    headerName: key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
    flex: 1,
    minWidth: 120,
  }));

  // Add id to each row
  const rows = data.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  return { rows, cols };
};
const AIChatInterface = () => {
  const { database } = useOutletContext();

  // Unique storage key per database to prevent chat mixing
  const STORAGE_KEY = database
    ? `chatMessages_${database}`
    : "chatMessages_default";

  // Load messages from localStorage on initial render (lazy initializer)
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [fetchQueryResponse, { isLoading }] = useFetchQueryResponseMutation();
  const messagesEndRef = useRef(null);

  //Save to localStorage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Failed to save messages to localStorage:", error);
    }
  }, [messages, STORAGE_KEY]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    //Added unique ID for each message (best practice for React list keys)
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      const response = await fetchQueryResponse({
        prompt: currentInput,
        dbName: database,
      }).unwrap();
      if (response?.result?.error?.message !== undefined) {
        throw new Error(response?.result?.error?.message);
      }
      const botMessage = {
        id: Date.now() + 1,
        text: response.summary,
        sender: "bot",
        chartType: response.chart_type,
        sqlQuery: response.sql_query,
        action: response.action,
        result: response.result,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        text:
          "Sorry, I encountered an error: " +
          (err || "Internal server error"),
        sender: "bot",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header Section */}
      <div className="flex flex-col p-2 border-b border-zinc-800 bg-zinc-900">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white">AI Chat Assistant</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Ask questions about your database in natural language
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className=" flex flex-row text-xs text-zinc-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Main Content (Messages or Splash) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-blue-900/20 flex items-center justify-center mb-6">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">
              Start a Conversation
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              Ask questions about your database and I'll help you write SQL
              queries and analyze your data.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  } gap-3`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.sender === "user" ? "bg-zinc-700" : "bg-blue-900/40"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="h-4 w-4 text-zinc-300" />
                    ) : (
                      <Bot className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : msg.isError
                          ? "bg-red-900/20 border border-red-900/50 text-red-200 rounded-tl-none"
                          : "bg-zinc-800/80 text-zinc-200 rounded-tl-none border border-zinc-700/50"
                    }`}
                  >
                    {msg.text}
                    {msg.sqlQuery && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-blue-400">
                            Generated SQL:
                          </span>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(msg.sqlQuery)
                            }
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            title="Copy SQL"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <div className="bg-zinc-900/50 px-3 py-2 rounded border border-zinc-800">
                          <code className="text-xs font-mono text-blue-300">
                            {msg.sqlQuery}
                          </code>
                        </div>
                      </div>
                    )}
                    {msg.action && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-blue-400">
                            Action:
                          </span>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(msg.action)
                            }
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            title="Copy Action"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <div className="bg-zinc-900/50 px-3 py-2 rounded border border-zinc-800">
                          <code className="text-xs font-mono text-blue-300">
                            {msg.action}
                          </code>
                        </div>
                      </div>
                    )}
                    {msg?.result?.result &&
                      (() => {
                        const { rows, cols } = transformResultToGrid(
                          msg.result.result,
                        );

                        return (
                          <Box
                            sx={{
                              height: 350,
                              width: "100%",
                              mt: 2,
                              borderRadius: "12px",
                              overflow: "hidden",
                              border: "1px solid #27272a",
                              bgcolor: "#09090b", // zinc-950
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                          >
                            <DataGrid
                              rows={rows}
                              columns={cols}
                              pageSizeOptions={[5]}
                              disableRowSelectionOnClick
                              initialState={{
                                pagination: {
                                  paginationModel: { pageSize: 5 },
                                },
                              }}
                              sx={{
                                border: "none",
                                color: "#e4e4e7",
                                backgroundColor: "#09090b",

                                "& .MuiDataGrid-columnHeaders": {
                                  backgroundColor: "#18181b",
                                  color: "#1d1d1fff",
                                  fontSize: "0.85rem",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                  borderBottom: "1px solid #27272a",
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                  fontWeight: 700,
                                  color: "#3c3c3fff",
                                },

                                // Rows
                                "& .MuiDataGrid-row": {
                                  backgroundColor: "#09090b",
                                  transition: "background-color 0.2s",
                                },

                                "& .MuiDataGrid-row:hover": {
                                  backgroundColor: "#18181b",
                                },

                                // Cells
                                "& .MuiDataGrid-cell": {
                                  borderColor: "#27272a",
                                  fontSize: "0.8125rem",
                                  color: "#e4e4e7",
                                  backgroundColor: "transparent",
                                },

                                // Footer/Pagination - make it lighter
                                "& .MuiDataGrid-footerContainer": {
                                  backgroundColor: "#18181b", // zinc-900 - lighter than pure black
                                  borderTop: "1px solid #b0b0bdff",
                                  color: "#a1a1aa", // zinc-400 - lighter text
                                },

                                "& .MuiTablePagination-root": {
                                  color: "#a1a1aa", // Lighter text
                                },

                                "& .MuiTablePagination-selectIcon": {
                                  color: "#a1a1aa",
                                },

                                "& .MuiDataGrid-virtualScroller": {
                                  "&::-webkit-scrollbar": {
                                    width: "8px",
                                    height: "8px",
                                  },
                                  "&::-webkit-scrollbar-track": {
                                    backgroundColor: "transparent",
                                  },
                                  "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "#27272a",
                                    borderRadius: "4px",
                                  },
                                  "&::-webkit-scrollbar-thumb:hover": {
                                    backgroundColor: "#3f3f46",
                                  },
                                },
                              }}
                            />
                          </Box>
                        );
                      })()}

                    {msg?.result?.result &&
                      msg?.chartType &&
                      msg?.chartType !== "none" &&
                      (() => {
                        const data = msg.result.result;
                        if (!data || data.length === 0) return null;

                        const keys = Object.keys(data[0]);
                        const labelKey = keys[0];
                        const valueKeys = keys.slice(1).filter((k) => {
                          const val = data[0][k];
                          return typeof val === "number" || !isNaN(Number(val));
                        });

                        if (valueKeys.length === 0) return null;

                        const chartTheme = {
                          "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                            fill: "#a1a1aa",
                          },
                          "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                            fill: "#a1a1aa",
                          },
                          "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                            stroke: "#27272a",
                          },
                          "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                            stroke: "#27272a",
                          },
                          "& .MuiChartsLegend-root text": {
                            fill: "#e4e4e7 !important",
                          },
                        };

                        const commonProps = {
                          height: 300,
                          margin: { top: 40, right: 20, bottom: 60, left: 60 },
                          sx: chartTheme,
                        };

                        return (
                          <Box
                            sx={{
                              mt: 3,
                              p: 2,
                              bgcolor: "rgba(255, 255, 255, 0.02)",
                              borderRadius: 3,
                              border: "1px solid rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            <div className="text-xs font-medium text-zinc-500 mb-4 uppercase tracking-wider">
                              Visual Analysis: {msg.chartType} chart
                            </div>
                            {msg.chartType === "bar" && (
                              <BarChart
                                {...commonProps}
                                xAxis={[
                                  {
                                    data: data.map((d) => String(d[labelKey])),
                                    scaleType: "band",
                                    label: labelKey.toUpperCase(),
                                  },
                                ]}
                                series={valueKeys.map((k) => ({
                                  data: data.map((d) => Number(d[k])),
                                  label: k.replace(/_/g, " ").toUpperCase(),
                                }))}
                              />
                            )}
                            {msg.chartType === "line" && (
                              <LineChart
                                {...commonProps}
                                xAxis={[
                                  {
                                    data: data.map((d) => String(d[labelKey])),
                                    scaleType: "point",
                                    label: labelKey.toUpperCase(),
                                  },
                                ]}
                                series={valueKeys.map((k) => ({
                                  data: data.map((d) => Number(d[k])),
                                  label: k.replace(/_/g, " ").toUpperCase(),
                                  area: true,
                                }))}
                              />
                            )}
                            {msg.chartType === "pie" && (
                              <PieChart
                                height={300}
                                sx={chartTheme}
                                series={[
                                  {
                                    data: data.map((d, i) => ({
                                      id: i,
                                      value: Number(d[valueKeys[0]]),
                                      label: String(d[labelKey]),
                                    })),
                                    innerRadius: 30,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                  },
                                ]}
                              />
                            )}
                            {msg.chartType === "scatter" && (
                              <ScatterChart
                                height={300}
                                sx={chartTheme}
                                series={[
                                  {
                                    data: data.map((d, i) => ({
                                      id: i,
                                      value: Number(d[valueKeys[0]]),
                                      label: String(d[labelKey]),
                                    })),
                                    innerRadius: 30,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                  },
                                ]}
                              />
                            )}
                          </Box>
                        );
                      })()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-row gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-900/40 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="bg-zinc-800/80 px-4 py-3 rounded-2xl rounded-tl-none border border-zinc-700/50 flex space-x-1 items-center">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-3 pb-3 border-t bg-zinc-900 border-zinc-800">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything about your database... (e.g., 'Show me users who signed up last month')"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all ${
              isLoading || !input.trim()
                ? "text-zinc-600 bg-transparent cursor-not-allowed"
                : "text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-xs text-zinc-500">
            AI can make mistakes. Check important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
