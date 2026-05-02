import { useState, useRef, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { Bot, Send, User, Copy, Trash2, Play, Clock, AlertTriangle } from "lucide-react";
import { useFetchQueryResponseMutation } from "../../features/schema/agentApi";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button as MuiButton } from "@mui/material";
import ChartVisual from "../ChartVisual";
import { transformResultToGrid, extractSchema } from "../ui/utils";

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

  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [fetchQueryResponse, { isLoading }] = useFetchQueryResponseMutation();
  const messagesEndRef = useRef(null);
  const [isClearChatDialogOpen, setIsClearChatDialogOpen] = useState(false);

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
          "Sorry, I encountered an error: " + (err || "Internal server error"),
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
    setIsClearChatDialogOpen(true);
  };

  const handleConfirmClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setIsClearChatDialogOpen(false);
  };

  const handleExecuteSql = (sqlQuery) => {
    navigate("/query", { state: { sqlQuery } });
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header Section */}
      <div className="flex flex-col p-4 border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">AI Chat Assistant</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Natural language database interface
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-red-400 transition-all px-3 py-1.5 rounded-lg hover:bg-red-400/10 border border-zinc-800 hover:border-red-400/20"
            >
              <Trash2 className="h-3.5 w-3.5" /> 
              <span className="hidden sm:inline">Clear Chat</span>
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
          <div className="max-w-5xl mx-auto space-y-6 w-full">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex flex-col sm:flex-row ${
                    msg.sender === "user" ? "sm:flex-row-reverse" : "flex-row"
                  } gap-3 ${
                    msg.sender === "user"
                      ? "max-w-[85%] sm:max-w-[70%]"
                      : "w-full max-w-[95%] sm:max-w-[85%] md:max-w-[80%]"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                      msg.sender === "user" ? "bg-zinc-700 ml-auto sm:ml-0" : "bg-blue-900/40"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="h-4 w-4 text-zinc-300" />
                    ) : (
                      <Bot className="h-4 w-4 text-blue-400" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden min-w-0 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : msg.isError
                          ? "bg-red-900/20 border border-red-900/50 text-red-200 rounded-tl-none w-full"
                          : "bg-zinc-800/80 text-zinc-200 rounded-tl-none border border-zinc-700/50 w-full"
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
                            onClick={() => {
                              handleExecuteSql(msg.sqlQuery);
                            }}
                            className="flex flex-row items-center gap-1 bg-green-800 hover:bg-green-700 text-white px-1 py-1 text-xs font-medium rounded-lg transition-colors"
                            title="Execute SQL"
                          >
                            <Play size={12} /> Execute Sql
                          </button>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(msg.action)
                            }
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                            title="Copy Action"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <div className="bg-zinc-900/50 px-3 py-2 rounded border border-zinc-800 overflow-x-auto custom-scrollbar">
                          <code className="text-xs font-mono text-blue-300 whitespace-pre">
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
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                            title="Copy Action"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <div className="bg-zinc-900/50 px-3 py-2 rounded border border-zinc-800 overflow-x-auto custom-scrollbar">
                          <code className="text-xs font-mono text-blue-300 whitespace-pre">
                            {msg.action}
                          </code>
                        </div>
                      </div>
                    )}
                    {msg?.result?.result && Array.isArray(msg.result.result) && msg.result.result.length > 0 &&
                      (() => {
                        const { rows, cols } = transformResultToGrid(
                          msg.result.result,
                        );

                        if (rows.length === 0) return null;

                        return (
                          <>
                            {msg.result.executionTime !== undefined && (
                              <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1 px-1">
                                <Clock size={10} />
                                Executed in {msg.result.executionTime}ms
                              </div>
                            )}
                            <Box
                            sx={{
                              height: 350,
                              width: "100%",
                              maxWidth: "100%",
                              mt: 2,
                              borderRadius: "12px",
                              overflow: "hidden",
                              border: "1px solid #27272a",
                              bgcolor: "#09090b", // zinc-950
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              "& .MuiDataGrid-root": {
                                minWidth: "100%",
                              }
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
                        </>
                        );
                      })()}

                    {msg?.result?.result &&
                      Array.isArray(msg.result.result) &&
                      msg.result.result.length > 0 &&
                      msg?.chartType &&
                      msg?.chartType !== "none" &&
                      extractSchema(msg.result.result).numericCols.length > 0 && (
                        <Box
                          sx={{
                            mt: 3,
                            p: 1,
                            bgcolor: "rgba(255, 255, 255, 0.02)",
                            borderRadius: 3,
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            overflow: "hidden",
                            width: "100%",
                          }}
                        >
                          <div className="text-xs font-medium text-zinc-500 mb-2 px-2 uppercase tracking-wider">
                            Visual Analysis
                          </div>
                          <ChartVisual
                            queryResult={msg.result.result}
                            initialChartType={msg.chartType}
                          />
                        </Box>
                      )}
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

      <div className="p-4 border-t bg-zinc-900 border-zinc-800">
        <div className="relative max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything about your database..."
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl py-3.5 pl-5 pr-14 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all ${
              isLoading || !input.trim()
                ? "text-zinc-600 bg-transparent cursor-not-allowed"
                : "text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-center mt-3">
          <p className="text-[10px] sm:text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
            <Bot size={12} className="text-blue-500/50" />
            AI can make mistakes. Please verify critical data.
          </p>
        </div>
      </div>

      <Dialog
        open={isClearChatDialogOpen}
        onClose={() => setIsClearChatDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#09090b",
            color: "white",
            borderRadius: "16px",
            border: "1px solid #27272a",
            backgroundImage: "none",
            p: 1,
            maxWidth: "400px",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2, pt: 3 }}>
          <Box sx={{ 
            bgcolor: "rgba(239, 68, 68, 0.1)", 
            p: 2, 
            borderRadius: "50%", 
            mb: 2,
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </Box>
          <DialogTitle sx={{ 
            fontWeight: 800, 
            fontSize: "1.5rem", 
            textAlign: "center",
            p: 0,
            mb: 1,
            color: "#ffffff"
          }}>
            Clear Chat?
          </DialogTitle>
          <DialogContent sx={{ pb: 0 }}>
            <DialogContentText sx={{ 
              color: "#a1a1aa", 
              textAlign: "center",
              fontSize: "0.95rem",
              lineHeight: 1.5
            }}>
              This will permanently delete all messages in this conversation. This
              action cannot be undone.
            </DialogContentText>
          </DialogContent>
        </Box>
        <DialogActions sx={{ p: 3, pt: 2, gap: 1.5 }}>
          <MuiButton
            onClick={() => setIsClearChatDialogOpen(false)}
            fullWidth
            sx={{ 
              color: "#ffffff", 
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#27272a",
              borderRadius: "10px",
              py: 1.2,
              "&:hover": { bgcolor: "#3f3f46" }
            }}
          >
            Cancel
          </MuiButton>
          <MuiButton
            onClick={handleConfirmClearChat}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#ef4444",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              py: 1.2,
              "&:hover": { bgcolor: "#dc2626" },
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)"
            }}
          >
            Clear All
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AIChatInterface;
