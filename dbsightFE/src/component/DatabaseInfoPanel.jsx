import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import { Database, ChevronDown, Check } from "lucide-react";
import { useLazyGetDatabaseConnectionQuery } from "../features/schema/databaseConnectionApi";

const DatabaseInfoPanel = ({reconnectDatabase, database, setDatabase}) => {

  const handleChange = (event) => {
    reconnectDatabase(event.target.value);
    setDatabase(event.target.value);
  };

  const [trigger, { data: databases, error, isLoading }] =
    useLazyGetDatabaseConnectionQuery();

  useEffect(() => {
    trigger();
  }, [trigger]);

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", p: 1 }}>
        <Skeleton
          variant="rounded"
          width="100%"
          height={48}
          animation="pulse"
          sx={{ backgroundColor: "#4b4545ff" }}
        />
      </Box>
    );
  }
  // Error state
  if (error) {
    return (
      <Box sx={{ width: "100%", color: "#f87171", fontSize: "0.85rem" }}>
        Failed to load connections
      </Box>
    );
  }

  // No data / empty array
  if (!databases || databases.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          color: "rgba(255,255,255,0.5)",
          p: 1,
          fontSize: "0.85rem",
        }}
      >
        No connections found
      </Box>
    );
  }

  const handleDropdownOpen = () => {
    trigger();
  };


  const selectedDb =
    databases.find((db) => db.database_name === database) || databases[0];
  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={1.5}>
        {/* Database Selector */}
        <FormControl fullWidth>
          <Select
            value={database}
            onChange={handleChange}
            displayEmpty
            variant="outlined"
            onOpen={handleDropdownOpen}
            IconComponent={(props) => (
              <ChevronDown
                {...props}
                style={{
                  color: "rgba(255, 255, 255, 0.4)",
                  marginRight: "12px",
                  width: 20,
                  height: 20,
                }}
              />
            )}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 2,
              height: 48,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                paddingLeft: "14px !important",
              },
              color: "white",
              fontWeight: 500,
            }}
            renderValue={() => {
              const label = selectedDb?.database_name || "Select Database";
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Database size={20} />
                  <span>
                    {label.length > 12 ? (
                      <Tooltip title={label} placement="top-start" arrow>
                        <span>{`${label.slice(0, 12)}...`}</span>
                      </Tooltip>
                    ) : (
                      <Tooltip title={label} placement="top-start" arrow>
                        <span>{label}</span>
                      </Tooltip>
                    )}
                  </span>
                </Box>
              );
            }}
          >
            {databases.map((db) => (
              <MenuItem key={db.database_name} value={db.database_name}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: 1.5,
                  }}
                >
                  {/* Left: Icon + Label */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{db.database_name}</span>
                  </Box>

                  {/* Right: Status Indicator */}
                  {db.is_connected ? (
                    <Check
                      size={18}
                      style={{
                        color: "#4ade80",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        bgcolor: "rgba(248, 113, 113, 0.5)",
                        color: "#a33f3f",
                        borderRadius: "999px",
                        px: 1,
                        py: 0.25,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        flexShrink: 0,
                      }}
                    >
                      OFFLINE
                    </Box>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Connection Status Chip below dropdown */}
        {selectedDb?.is_connected ? (
          <Box>
            <Chip
              label="Connected"
              size="small"
              sx={{
                bgcolor: "rgba(34, 197, 94, 0.2)",
                color: "#4ade80",
                fontWeight: 600,
                height: 28,
                "& .MuiChip-label": {
                  paddingLeft: 1,
                  paddingRight: 1.5,
                },
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  bgcolor: "#4ade80",
                  borderRadius: "50%",
                  marginRight: 0.5,
                  marginLeft: 1.5,
                },
              }}
            />
          </Box>
        ) : (
          <Box>
            <Chip
              label="Disconnected"
              size="small"
              sx={{
                bgcolor: "rgba(248, 113, 113, 0.2)",
                color: "#f87171",
                fontWeight: 600,
                height: 28,
                "& .MuiChip-label": {
                  paddingLeft: 1,
                  paddingRight: 1.5,
                },
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  bgcolor: "#f87171",
                  borderRadius: "50%",
                  marginRight: 0.5,
                  marginLeft: 1.5,
                },
              }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default DatabaseInfoPanel;
