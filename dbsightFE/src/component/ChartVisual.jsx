import { useState, useMemo, useRef } from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { Download, FileSpreadsheet, ImageIcon } from "lucide-react";
import { extractSchema, downloadCSV } from "./ui/utils";

const ChartVisual = ({ queryResult, initialChartType = "BAR" }) => {
  const [config, setConfig] = useState({
    chartType: (initialChartType || "BAR").toUpperCase(),
    xAxis: "",
    yAxis: "",
  });
  const chartRef = useRef(null);

  const schema = useMemo(() => extractSchema(queryResult), [queryResult]);
  const data = queryResult || [];

  // Auto-select and validate axes when schema or data changes
  useEffect(() => {
    if (schema.columns.length > 0) {
      const newConfig = { ...config };
      let changed = false;

      // If current xAxis is invalid or not set, pick the first column
      if (!config.xAxis || !schema.columns.includes(config.xAxis)) {
        newConfig.xAxis = schema.columns[0];
        changed = true;
      }

      // If current yAxis is invalid or not set, pick the first numeric column
      if (!config.yAxis || !schema.numericCols.includes(config.yAxis)) {
        if (schema.numericCols.length > 0) {
          newConfig.yAxis = schema.numericCols[0];
        } else if (schema.columns.length > 1) {
          // Fallback to second column if no numeric columns found
          newConfig.yAxis = schema.columns[1];
        }
        changed = true;
      }

      if (changed) {
        setConfig(newConfig);
      }
    }
  }, [schema, config.xAxis, config.yAxis]);

  const handleDownloadImage = () => {
    if (!chartRef.current) return;
    const svg = chartRef.current.querySelector("svg");
    if (!svg) return;

    // Get the actual dimensions of the SVG
    const bounds = svg.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;

    // Clone the SVG and set explicit dimensions
    // This is crucial because if the SVG has width="100%", the Image loader 
    // won't know how to size it correctly from a Blob.
    const clonedSvg = svg.cloneNode(true);
    clonedSvg.setAttribute("width", width);
    clonedSvg.setAttribute("height", height);

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Use 2x scaling for high quality
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);
      
      // Fill background (same as the chart container)
      ctx.fillStyle = "#18181b"; // zinc-900 background
      ctx.fillRect(0, 0, width, height);
      
      // Draw the SVG image onto the canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `chart-${config.chartType.toLowerCase()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    // If there's an error loading the image
    img.onerror = () => {
      console.error("Failed to load SVG for image export");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const handleDownloadCSV = () => {
    downloadCSV(data, `chart-data-${config.chartType.toLowerCase()}.csv`);
  };

  const chartTheme = {
    "& .MuiChartsAxis-label": {
      fill: "#ffffff !important",
    },
    "& .MuiChartsYAxis-tickLabel": {
      fill: "#a1a1aa !important",
    },
    "& .MuiChartsXAxis-label": {
      fill: "#ffffff !important",
    },
    "& .MuiChartsYAxis-label": {
      fill: "#ffffff !important",
    },
    "& .MuiChartsXAxis-tickLabel": {
      fill: "#a1a1aa !important",
    },
    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
      fill: "#a1a1aa !important",
    },
    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
      fill: "#a1a1aa !important",
    },
    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
      stroke: "#3f3f46",
    },
    "& .MuiChartsAxis-left .MuiChartsAxis-line": {
      stroke: "#3f3f46",
    },
    "& .MuiChartsLegend-root": {
      color: "#e4e4e7",
    },
    "& .MuiChartsLegend-root text": {
      fill: "#e4e4e7 !important",
    },
    "& .MuiChartsLegend-series text": {
      fill: "#e4e4e7 !important",
    },
  };

  const renderChart = () => {
    if (data.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
            color: "white",
          }}
        >
          <Typography color="text.secondary">
            No data available for visualization
          </Typography>
        </Box>
      );
    }

    if (!config.xAxis || (!config.yAxis && config.chartType !== "PIE")) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
            color: "white",
          }}
        >
          <Typography color="text.secondary">
            Please select X and Y axes to render the chart
          </Typography>
        </Box>
      );
    }

    const commonProps = {
      height: 350,
      width: 1100,
      margin: { top: 40, right: 20, bottom: 60, left: 60 },
      sx: chartTheme,
    };

    const chartData = data.slice(0, 50); // Limit to 50 points for better performance/visibility

    switch (config.chartType) {
      case "BAR":
        return (
          <BarChart
            {...commonProps}
            xAxis={[
              {
                data: chartData.map((d) => String(d[config.xAxis] ?? "N/A")),
                scaleType: "band",
                label: config.xAxis.toUpperCase(),
              },
            ]}
            series={[
              {
                data: chartData.map((d) => {
                  const val = Number(d[config.yAxis]);
                  return isNaN(val) ? 0 : val;
                }),
                label: config.yAxis.replace(/_/g, " ").toUpperCase(),
                color: "#3b82f6",
              },
            ]}
          />
        );
      case "LINE":
        return (
          <LineChart
            {...commonProps}
            xAxis={[
              {
                data: chartData.map((d) => String(d[config.xAxis] ?? "N/A")),
                scaleType: "point",
                label: config.xAxis.toUpperCase(),
              },
            ]}
            series={[
              {
                data: chartData.map((d) => {
                  const val = Number(d[config.yAxis]);
                  return isNaN(val) ? 0 : val;
                }),
                label: config.yAxis.replace(/_/g, " ").toUpperCase(),
                color: "#10b981",
                area: true,
              },
            ]}
          />
        );
      case "PIE":
        return (
          <PieChart
            height={320}
            width={1100}
            sx={chartTheme}
            series={[
              {
                data: chartData.slice(0, 10).map((d, i) => {
                  const val = Number(d[config.yAxis || schema.numericCols[0]]);
                  return {
                    id: i,
                    value: isNaN(val) ? 0 : val,
                    label: String(d[config.xAxis] ?? `Item ${i}`),
                  };
                }),
                innerRadius: 60,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 8,
                cx: "50%",
              },
            ]}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: 0,
              },
            }}
          />
        );
      case "SCATTER":
        return (
          <ScatterChart
            {...commonProps}
            series={[
              {
                data: chartData.map((d, i) => {
                  const xVal = Number(d[config.xAxis]);
                  const yVal = Number(d[config.yAxis]);
                  return {
                    x: isNaN(xVal) ? 0 : xVal,
                    y: isNaN(yVal) ? 0 : yVal,
                    id: i,
                  };
                }),
                label: `${config.yAxis} vs ${config.xAxis}`,
                color: "#f59e0b",
              },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: "#a1a1aa" }}>Chart Type</InputLabel>
          <Select
            value={config.chartType}
            label="Chart Type"
            onChange={(e) =>
              setConfig({ ...config, chartType: e.target.value })
            }
            sx={{
              color: "#fff",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#3f3f46" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#52525b",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
              },
              ".MuiSvgIcon-root": { color: "#a1a1aa" },
            }}
          >
            <MenuItem value="BAR">Bar Chart</MenuItem>
            <MenuItem value="LINE">Line Chart</MenuItem>
            <MenuItem value="PIE">Pie Chart</MenuItem>
            <MenuItem value="SCATTER">Scatter Chart</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: "#a1a1aa" }}>X-Axis (Labels)</InputLabel>
          <Select
            value={config.xAxis}
            label="X-Axis (Labels)"
            onChange={(e) => setConfig({ ...config, xAxis: e.target.value })}
            sx={{
              color: "#fff",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#3f3f46" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#52525b",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
              },
              ".MuiSvgIcon-root": { color: "#a1a1aa" },
            }}
          >
            {schema.columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: "#a1a1aa" }}>Y-Axis (Values)</InputLabel>
          <Select
            value={config.yAxis}
            label="Y-Axis (Values)"
            onChange={(e) => setConfig({ ...config, yAxis: e.target.value })}
            sx={{
              color: "#fff",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#3f3f46" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#52525b",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
              },
              ".MuiSvgIcon-root": { color: "#a1a1aa" },
            }}
          >
            {schema.numericCols.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Download CSV">
            <IconButton 
              onClick={handleDownloadCSV}
              sx={{ color: "#a1a1aa", "&:hover": { color: "#3b82f6", bgcolor: "rgba(59, 130, 246, 0.1)" } }}
            >
              <FileSpreadsheet size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download PNG">
            <IconButton 
              onClick={handleDownloadImage}
              sx={{ color: "#a1a1aa", "&:hover": { color: "#10b981", bgcolor: "rgba(16, 185, 129, 0.1)" } }}
            >
              <ImageIcon size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper
        elevation={0}
        ref={chartRef}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.03)",
          borderRadius: 2,
          border: "1px solid #27272a",
          p: 2,
          minHeight: 350,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {renderChart()}
      </Paper>
    </Box>
  );
};

export default ChartVisual;
