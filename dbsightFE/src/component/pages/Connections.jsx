import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Database,
  DeleteIcon,
  PlusCircle,
  RefreshCwIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";
import NewConnectionFormPop from "../NewConnectionFormPop";
import { useGetDatabaseConnectionQuery } from "../../features/schema/databaseConnectionApi";
const Connections = () => {
  const { data, isLoading, isError } = useGetDatabaseConnectionQuery();
  const [openNewConnectionForm, setOpenNewConnectionForm] = useState(false);
  console.log(data);
  const handleAddNewButtonClick = () => {
    setOpenNewConnectionForm(true);
  };
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header Section */}
      <div className="flex items-center justify-between p-5 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-white">Database Connections</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your database connections
          </p>
        </div>

        <Button variant="contained" onClick={handleAddNewButtonClick}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Connection
        </Button>
      </div>
      <div className="p-4 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((item, _) => (
            <Card
              key={item.databaseName}
              sx={{
                bgcolor: "#18181b",
                color: "white",
                border: "1px solid #27272a",
              }}
            >
              <CardContent>
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500 ">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.125rem",
                            color: "#ffffff",
                            letterSpacing: "-0.025em",
                          }}
                          className="truncate"
                        >
                          {item.connection_name}
                        </Typography>
                        <span className="ml-auto shrink-0 px-2 py-0.5 text-xs font-medium">
                          {item.is_connected ? (
                            <>
                              <span className="flex items-center gap-2 p-1 px-2 bg-green-900/70 text-green-400 font-bold rounded-full">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                Connected
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="flex items-center gap-2 p-1 px-2 bg-red-900/70 text-red-400 font-bold rounded-full">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                Disconnected
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#ababc0ff",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                        className="truncate flex items-center gap-1.5"
                      >
                        {item.database_name}
                      </Typography>
                    </div>
                  </div>
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#a1a1aa",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span className="font-bold text-sm text-zinc-400">
                      username
                    </span>
                    <span className="text-zinc-100 text-sm">
                      {item.username}
                    </span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#a1a1aa",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span className="font-bold text-sm text-zinc-400">
                      username
                    </span>
                    <span className="text-zinc-100 text-sm">
                      {item.username}
                    </span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#a1a1aa",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span className="font-bold text-sm text-zinc-400">
                      host
                    </span>
                    <span className="text-zinc-100 text-sm">{item.host}</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#a1a1aa",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span className="font-bold text-sm text-zinc-400">
                      port
                    </span>
                    <span className="text-zinc-100 text-sm">{item.port}</span>
                  </Typography>
                </div>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 1,
                  padding: "16px",
                  paddingTop: "8px",
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<RefreshCwIcon />}
                  sx={{
                    flex: "1 1 auto",
                    minWidth: "0",
                    color: "#fff",
                    bgcolor: "#1976d2",
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    "&:hover": {
                      bgcolor: "#265b97ff",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Reconnect
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Trash />}
                  sx={{
                    flex: "1 1 auto",
                    minWidth: "0",
                    color: "#fff",
                    bgcolor: "#d32f2f",
                    textTransform: "none",
                    fontWeight: 600,
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    "&:hover": {
                      bgcolor: "#8b2929ff",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
      {openNewConnectionForm && (
        <NewConnectionFormPop
          openNewConnectionForm={openNewConnectionForm}
          setOpenNewConnectionForm={setOpenNewConnectionForm}
        />
      )}
    </div>
  );
};

export default Connections;
