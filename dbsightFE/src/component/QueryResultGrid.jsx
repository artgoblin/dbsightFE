import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { transformResultToGrid } from "./ui/utils";



const QueryResultGrid = ({
  executionResult,
  handleLoadMore,
  offset,
  hasMore,
  loading,
}) => {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const scroller = grid.querySelector(".MuiDataGrid-virtualScroller");
    if (!scroller) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;

      if (scrollHeight - scrollTop - clientHeight < 50) {
        if (handleLoadMore) handleLoadMore();
      }
    };

    scroller.addEventListener("scroll", handleScroll);

    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [offset, hasMore, loading, handleLoadMore]);

  return (
    <Box
      ref={gridRef}
      sx={{
        flex: 1,
        width: "100%",
        mt: 1,
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #27272a",
        bgcolor: "#09090b",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DataGrid
        rows={transformResultToGrid(executionResult).rows}
        columns={transformResultToGrid(executionResult).cols}
        showToolbar
        sx={{
          border: "none",
          color: "#e4e4e7",
          backgroundColor: "#09090b",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#18181b",
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid #27272a",
            minHeight: "36px !important",
            maxHeight: "36px !important",
            lineHeight: "36px !important",
          },
          "& .MuiDataGrid-toolbar": {
            backgroundColor: "#18181b",
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderBottom: "1px solid #27272a",
            minHeight: "36px !important",
            maxHeight: "36px !important",
            lineHeight: "36px !important",
          },
          "& .MuiDataGrid-toolbar .MuiSvgIcon-root, & .MuiDataGrid-toolbar button":
            {
              color: "#ffffff",
            },
          "& .MuiDataGrid-toolbar .MuiInputBase-input": {
            color: "#ffffff !important",
            caretColor: "#ffffff !important",
          },
          "& .MuiDataGrid-toolbar button:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
          "& .MuiDataGrid-columnHeader": {
            height: "36px !important",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            color: "#454547",
            fontSize: "0.7rem",
          },
          "& .MuiDataGrid-row": {
            backgroundColor: "#09090b",
            transition: "background-color 0.2s",
          },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#18181b" },
          "& .MuiDataGrid-cell": {
            borderColor: "#27272a",
            fontSize: "0.8125rem",
            color: "#e4e4e7",
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#18181b",
            color: "#a1a1aa",
          },
          "& .MuiTablePagination-root": { color: "#a1a1aa" },
          "& .MuiTablePagination-selectIcon": { color: "#a1a1aa" },
        }}
      />
    </Box>
  );
};

export default QueryResultGrid;
