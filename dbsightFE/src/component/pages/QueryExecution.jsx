import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Play,
  Clock,
  Bookmark,
  X,
  Pencil,
  Trash,
  PlayCircle,
  Save,
  View,
  Share,
  Download,
  Share2,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import Tooltip from "@mui/material/Tooltip";
import {
  useDeleteSavedQueryMutation,
  useExecuteSqlMutation,
  useGetAllQueryCacheQuery,
  useGetAllSavedQueryQuery,
  useSaveQueryMutation,
} from "../../features/schema/queryExecutionApi";
import { useOutletContext } from "react-router";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Box, Snackbar } from "@mui/material";
import SaveQueryFormPop from "../SaveQueryFormPop";
import VisualizePop from "../VisualizePop";
import QueryResultGrid from "../QueryResultGrid";
const QueryExecution = () => {
  const { data: queryHistory } = useGetAllQueryCacheQuery();
  const { data: savedQueries } = useGetAllSavedQueryQuery();
  const [deleteSavedQuery] = useDeleteSavedQueryMutation();
  const { database } = useOutletContext();

  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem("dbsight_query_tabs");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "tab-1",
            name: "Query 1",
            query: "-- Write your SQL query here\n",
            hasResults: false,
          },
        ];
  });

  const [activeTabId, setActiveTabId] = useState(() => {
    return localStorage.getItem("dbsight_activeTabId") || "tab-1";
  });

  const [executeSql, { isLoading: isExecuting }] = useExecuteSqlMutation();
  const [loading, setLoading] = useState(false);

  const [tabContents, setTabContents] = useState(() => {
    const saved = localStorage.getItem("dbsight_tabContents");
    return saved
      ? JSON.parse(saved)
      : {
          "tab-1": "-- Write your SQL query here\n",
        };
  });

  useEffect(() => {
    localStorage.setItem("dbsight_query_tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem("dbsight_activeTabId", activeTabId);
  }, [activeTabId]);

  useEffect(() => {
    localStorage.setItem("dbsight_tabContents", JSON.stringify(tabContents));
  }, [tabContents]);
  const [executionResult, setExecutionResult] = useState(null);
  const editorRef = useRef(null);

  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [allRows, setAllRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [openSaveQueryModal, setOpenSaveQueryModal] = useState(false);
  const modalTitleRef = useRef(null);
  const editInitialValues = useRef(null);
  const [openVisualizeModal, setOpenVisualizeModal] = useState(false);
  // keep last request body so Load More can re-use it
  const lastRequestRef = useRef(null);

  const handleAddTab = (initialQuery = "") => {
    const queryText = typeof initialQuery === "string" ? initialQuery : "";
    const newTabId = `tab-${Date.now()}`;
    const newTabName = `Query ${tabs.length + 1}`;
    const newTab = {
      id: newTabId,
      name: newTabName,
      query: queryText,
      hasResults: false,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
    setTabContents((prev) => ({
      ...prev,
      [newTabId]: queryText,
    }));
  };

  const handleTabClick = (tabId) => setActiveTabId(tabId);

  const handleCloseTab = (tabId) => {
    if (tabs.length === 1) return; // Don't close the last tab

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    const newTabs = tabs.filter((tab) => tab.id !== tabId);

    // Update contents
    const newTabContents = { ...tabContents };
    delete newTabContents[tabId];
    setTabContents(newTabContents);

    setTabs(newTabs);

    // If closing the active tab, switch to a nearby tab
    if (activeTabId === tabId) {
      const nextTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(nextTab.id);
    }
  };
  const handleClearEditor = () => {
    setTabContents((prev) => ({
      ...prev,
      [activeTabId]: "",
    }));
  };

  const handleSqlExecution = () => {
    let selectedQuery = "";

    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      selectedQuery = editorRef.current.getModel().getValueInRange(selection);
    }

    const finalQuery =
      selectedQuery && selectedQuery.trim().length > 0
        ? selectedQuery
        : tabContents[activeTabId];

    const body = {
      sql_query: finalQuery,
      database_name: database,
    };

    lastRequestRef.current = body;

    executeSql({ body, offset: 0, limit })
      .unwrap()
      .then((res) => {
        const rows = res.result ?? [];
        setAllRows(rows);
        setExecutionResult(rows);
        setHasMore(
          res.hasMore !== undefined ? res.hasMore : rows.length === limit,
        );
        setOffset(limit);
        if (res.error?.code === "error" && res.error.message.length > 0) {
          throw new Error(res.error.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(err.message);
        setExecutionResult(null);
        setOpen(true);
      });
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await executeSql({
        body: lastRequestRef.current,
        offset,
        limit,
      }).unwrap();

      const newRows = res.result ?? [];
      setAllRows((prev) => [...prev, ...newRows]);
      setExecutionResult((prev) => [...prev, ...newRows]);
      setHasMore(
        res.hasMore !== undefined ? res.hasMore : newRows.length === limit,
      );
      setOffset((prev) => prev + limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([tabContents[activeTabId]], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${database}_${new Date().toISOString()}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  const handleSaveQuery = () => {
    modalTitleRef.current = "Save Query";
    setOpenSaveQueryModal(true);
    editInitialValues.current = {
      databaseName: database,
      query: tabContents[activeTabId],
      title: "",
      description: "",
    };
  };

  const handleSavedQueryDelete = (id) => {
    deleteSavedQuery(id)
      .unwrap()
      .then(() => {
        setOpen(true);
        setErrorMessage("Query deleted successfully");
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(err.message);
        setOpen(true);
      });
  };
  const handleEditQuery = (item, id) => {
    modalTitleRef.current = "Edit Query";
    setOpenSaveQueryModal(true);
    editInitialValues.current = {
      databaseName: item.database_name,
      query: item.query,
      title: item.title,
      description: item.description,
      id: item.id,
    };
  };
  return (
    <div className="flex flex-row h-screen bg-zinc-950 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-900 p-2 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">Query Execution</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Write and execute custom SQL queries
          </p>
        </div>

        {/* Query Tabs */}
        <div className="flex items-center border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0 overflow-x-auto w-full">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-1 text-sm font-medium flex items-center gap-2 border-t-2 transition whitespace-nowrap cursor-pointer select-none ${
                activeTabId === tab.id
                  ? "bg-zinc-800 text-white border-blue-500"
                  : "text-zinc-400 hover:text-white border-transparent hover:bg-zinc-800/50"
              }`}
            >
              {tab.name}
              {/* Close Button: Uses div wrapper + e.stopPropagation() to avoid nested button issues */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
                className="ml-1 p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddTab}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition flex-shrink-0"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* SQL Editor Area */}
        <div className="flex-1 min-h-0">
          <div className="flex items-center justify-end">
            <Tooltip title="Run Query" arrow>
              <PlayCircle
                onClick={handleSqlExecution}
                size={25}
                className="text-green-500 bg-green-500/20 rounded-full p-1 hover:text-white cursor-pointer mr-2 m-2"
              />
            </Tooltip>
            <Tooltip title="Visualize Data" arrow>
              <View
                size={25}
                onClick={() => setOpenVisualizeModal(true)}
                className="p-1 cursor-pointer bg-zinc-500/20 text-zinc-400 rounded-full hover:text-white cursor-pointer mr-2 m-2"
              />
            </Tooltip>
            <Tooltip title="Save Query" arrow>
              <Save
                size={25}
                onClick={handleSaveQuery}
                className="text-zinc-400 bg-zinc-500/20 rounded-full p-1 hover:text-white cursor-pointer mr-2 m-2"
              />
            </Tooltip>
            <Tooltip title="Clear Query" arrow>
              <Trash
                onClick={handleClearEditor}
                size={25}
                className="text-zinc-400 bg-zinc-500/20 rounded-full p-1 hover:text-white cursor-pointer mr-2 m-2"
              />
            </Tooltip>
            <Tooltip title="Download Script" arrow>
              <Download
                onClick={handleDownloadScript}
                size={25}
                className="p-1 cursor-pointer bg-zinc-500/20 text-zinc-400 rounded-full hover:text-white cursor-pointer mr-2 m-2"
              />
            </Tooltip>
          </div>
          <Editor
            height="80%"
            defaultLanguage="sql"
            path={activeTabId}
            value={tabContents[activeTabId] || ""}
            theme="vs-dark"
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            onChange={(value) =>
              setTabContents((prev) => ({
                ...prev,
                [activeTabId]: value || "",
              }))
            }
          />
        </div>

        {/* Results Area */}
        <div className="flex-1 bg-zinc-950 border-t border-zinc-800 overflow-hidden flex flex-col">
          {executionResult ? (
            <>
              <QueryResultGrid
                executionResult={executionResult}
                handleLoadMore={handleLoadMore}
                offset={offset}
                hasMore={hasMore}
                loading={loading}
              />
            </>
          ) : errorMessage?.length > 0 ? (
            <div className="h-full flex items-center justify-center text-red-500 p-2">
              <div className="text-center">
                <p className="mt-2 font-mono">{errorMessage}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <Play size={48} className="mx-auto mb-3 opacity-50" />
                <p>Execute a query to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-60 border-l border-zinc-800 bg-zinc-900 flex flex-col min-h-0">
        {/* Query History Section */}
        <div className="flex-1 flex flex-col min-h-0 border-b border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Clock size={18} />
              <h2>Query History</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {queryHistory?.map((item, indx) => {
              const displayQuery = typeof item === "object" ? item.query : item;
              return (
                <div
                  key={indx}
                  className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 cursor-pointer transition"
                  onClick={() => handleAddTab(displayQuery)}
                >
                  <p className="text-sm text-zinc-300 font-mono truncate">
                    <Tooltip title={displayQuery}>{displayQuery}</Tooltip>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saved Queries Section */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Bookmark size={18} />
              <h2>Saved Queries</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {savedQueries?.map((item, index) => (
              <div
                key={item.id || index}
                className="p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 cursor-pointer transition"
              >
                <div className="flex-1 flex items-end">
                  <h3 className="text-sm font-medium text-white truncate mb-2">
                    {item.title}
                  </h3>
                  <Pencil
                    size={18}
                    onClick={() => handleEditQuery(item)}
                    className="text-zinc-400 hover:text-white cursor-pointer ml-2 mb-2"
                  />
                  <Trash
                    size={18}
                    className="text-zinc-400 hover:text-white cursor-pointer ml-2 mb-2"
                    onClick={() => handleSavedQueryDelete(item.id)}
                  />
                </div>
                <div
                  onClick={() => {
                    if (item.query) {
                      handleAddTab(item.query);
                    }
                  }}
                >
                  <p className="text-xs text-zinc-400 font-mono truncate mb-3">
                    {item.query}
                  </p>

                  <div className="flex gap-2">
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded"
                    >
                      {item.description}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {openSaveQueryModal && (
        <SaveQueryFormPop
          openSaveQueryModal={openSaveQueryModal}
          modalTitleRef={modalTitleRef.current}
          initialValues={editInitialValues.current}
          setOpenSaveQueryModal={setOpenSaveQueryModal}
        />
      )}
      {openVisualizeModal && (
        <VisualizePop
          executionResult={executionResult}
          openVisualizeModal={openVisualizeModal}
          setOpenVisualizeModal={setOpenVisualizeModal}
          handleLoadMore={handleLoadMore}
          offset={offset}
          hasMore={hasMore}
          loading={loading}
        />
      )}
    </div>
  );
};

export default QueryExecution;
