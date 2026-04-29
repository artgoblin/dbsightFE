import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const transformResultToGrid = (data) => {
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

export function extractSchema(queryResult) {
  if (!queryResult || queryResult.length === 0) {
    return { columns: [], numericCols: [], categoricalCols: [] };
  }

  const columns = Object.keys(queryResult[0]);

  // Simple type inference from first row values
  const numericCols = [];
  const categoricalCols = [];

  const firstRow = queryResult[0];
  columns.forEach((col) => {
    const val = firstRow[col];
    if (val !== null && !isNaN(Number(val))) {
      numericCols.push(col);
    } else {
      categoricalCols.push(col);
    }
  });

  return { columns, numericCols, categoricalCols };
}

export const downloadCSV = (data, filename = "data.csv") => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) =>
        typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
      )
      .join(",")
  );
  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
