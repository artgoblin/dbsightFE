// src/features/schema/SchemaViewPanel.jsx
import React from "react";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import {
  Database,
  Table,
  Key,
  Folder,
  Columns3,
  Table2,
  TypeIcon,
  TypeOutlineIcon,
  FileText,
} from "lucide-react";
import { useGetSchemaDetailsQuery } from "../features/schema/databaseConnectionApi";
import { getToken } from "./ui/auth";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";

const getSafeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  if (typeof value === "object")
    return Object.values(value).filter((v) => typeof v === "string");
  return [];
};

const getColumnConstraints = (columnName, table) => {
  const primaryKeys = getSafeArray(table.primaryKeys);
  const uniqueColumns = getSafeArray(table.uniqueColumns);

  return {
    isPK: primaryKeys.includes(columnName),
    isUnique: uniqueColumns.includes(columnName),
    primaryKeys,
    uniqueColumns,
  };
};
const renderSchemaTree = (schemaData) => {
  if (!schemaData?.database_schema) return null;

  return Object.entries(schemaData.database_schema.databaseSchema).map(
    ([schemaName, tables]) => {
      if (!Array.isArray(tables)) {
        return null;
      }

      return (
        <TreeItem
          key={schemaName}
          itemId={schemaName}
          label={
            <div className="flex items-center gap-2">
              <Columns3 className="h-4 w-4 text-purple-500 flex-shrink-0" />
              {schemaName}
            </div>
          }
        >
          {tables.map((table, tableIndex) => {
            if (!table?.tableName || !Array.isArray(table.columns)) {
              return null;
            }

            const { isPK, isUnique } = getColumnConstraints(null, table); // we'll pass col name inside map

            return (
              <TreeItem
                key={`${table.tableName}-${tableIndex}`} // add index for safety
                itemId={`${schemaName}.${table.tableName}`}
                label={
                  <div className="flex items-center gap-2">
                    <Table2 className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    {table.tableName}
                  </div>
                }
              >
                {table.columns?.map((col, colIndex) => {
                  // Safety: skip invalid columns
                  if (!col?.columnName) {
                    return null;
                  }

                  const { isPK, isUnique } = getColumnConstraints(
                    col.columnName,
                    table,
                  );

                  return (
                    <Tooltip
                      key={`${col.columnName}-${colIndex}`}
                      title={
                        <div className="text-xs">
                          <div>
                            <strong>Type:</strong> {col.columnType || "unknown"}
                          </div>
                          {isPK && (
                            <div className="text-orange-300">Primary Key</div>
                          )}
                          {isUnique && (
                            <div className="text-green-400">Unique Key</div>
                          )}
                        </div>
                      }
                      placement="right"
                      arrow
                    >
                      <TreeItem
                        itemId={`${table.tableName}.${col.columnName}`}
                        label={
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{col.columnName}</span>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              {isPK && (
                                <Key className="h-4 w-4 text-red-400 flex-shrink-0" />
                              )}
                              {isUnique && (
                                <Key className="h-4 w-4 text-green-400 flex-shrink-0" />
                              )}
                            </div>

                            {col.columnType && (
                              <span className="text-[10px] text-gray-400 truncate max-w-[100px]">
                                {col.columnType}
                              </span>
                            )}
                          </div>
                        }
                      />
                    </Tooltip>
                  );
                })}
              </TreeItem>
            );
          })}
        </TreeItem>
      );
    },
  );
};

const SchemaViewPanel = ({ databaseName }) => {
  const { data, error, isLoading, isFetching } = useGetSchemaDetailsQuery(
    databaseName,
    {
      skip: !databaseName, // 👈 Skip query if no database selected
      refetchOnMountOrArgChange: true, // Optional: always refetch when arg changes
    },
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          color: "white",
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          gap: 1.5,
        }}
      >
        {["100%", "20%", "90%", "50%", "100%", "80%", "20%", "50%", "80%"].map(
          (w, i) => (
            <Skeleton
              key={i}
              animation="pulse"
              variant="rounded"
              width={w}
              height={6}
              sx={{ backgroundColor: "#4b4545ff" }}
            />
          ),
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: "#ff6b6b", p: 3 }}>
        Error: {error.message || "Failed to load schema"}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        color: "white",
        overflow: "auto",
        p: 2,
        "& .MuiTreeItem-root": {
          "& .MuiTreeItem-label": {
            fontSize: "0.9rem",
          },
          minWidth: "fit-content",
        },
      }}
    >
      <SimpleTreeView>
        <TreeItem
          itemId="root"
          label={
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500 flex-shrink-0" />
              {databaseName}
            </div>
          }
        >
          {data ? (
            renderSchemaTree(data)
          ) : (
            <TreeItem itemId="empty" label="No data" />
          )}
        </TreeItem>
      </SimpleTreeView>
    </Box>
  );
};

export default SchemaViewPanel;
