import { Box, Modal, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { X } from "lucide-react";
import { useState } from "react";

import QueryResultGrid from "./QueryResultGrid";
import ChartVisual from "./ChartVisual";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        flex: value === index ? 1 : 0,
        display: value === index ? "flex" : "none",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            pt: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}
const VisualizePop = ({
  executionResult,
  openVisualizeModal,
  setOpenVisualizeModal,
  handleLoadMore,
  offset,
  hasMore,
  loading,
}) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Modal
      open={openVisualizeModal}
      onClose={() => setOpenVisualizeModal(false)}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#1c1c1c",
          borderRadius: "10px",
          boxShadow: 24,
          width: "1200px",
          height: "550px",
          display: "flex",
          flexDirection: "column",
          p: 2,
          overflow: "hidden",
          outline: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>
            Visualize Query
          </Typography>
          <button
            onClick={() => setOpenVisualizeModal(false)}
            className="hover:bg-red-500/20 p-1 rounded-lg cursor-pointer"
          >
            <X color="#fff" />
          </button>
        </Box>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            borderBottom: "1px solid #4b4545ff",
          }}
        >
          <Tab
            label="Data Table"
            sx={{
              color: "#fff",
            }}
          />
          <Tab
            label="Charts"
            sx={{
              color: "#fff",
            }}
          />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <>
            <QueryResultGrid
              executionResult={executionResult}
              handleLoadMore={handleLoadMore}
              offset={offset}
              hasMore={hasMore}
              loading={loading}
            />
          </>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
         <ChartVisual queryResult={executionResult} />
        </CustomTabPanel>
      </Box>
    </Modal>
  );
};

export default VisualizePop;
