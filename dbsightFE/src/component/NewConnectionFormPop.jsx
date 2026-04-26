import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { useCreateDatabaseConnectionMutation } from "../features/schema/databaseConnectionApi";
import { X } from "lucide-react";

const inputStyle = {
  backgroundColor: "#2a2a2a",
  borderRadius: "6px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    "& fieldset": {
      borderColor: "#3a3a3a",
    },
    "&:hover fieldset": {
      borderColor: "#555",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#666",
    },
  },
  "& .MuiInputBase-input": {
    padding: "8px 10px",
    fontSize: "14px",
    color: "#fff",
  },
};

const labelStyle = {
  fontSize: "12px",
  color: "#aaa",
  marginBottom: "6px",
  fontWeight: 500,
};

const NewConnectionFormPop = ({
  openNewConnectionForm,
  setOpenNewConnectionForm,
}) => {
  const handleClose = () => setOpenNewConnectionForm(false);

  const [createDatabaseConnection] = useCreateDatabaseConnectionMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values) => {
    try {
      const payload = {
        connection_name: values.connectionName,
        db_type: values.databaseType,
        host: values.host,
        port: values.port,
        database_name: values.databaseName,
        username: values.username,
        password: values.password,
      };
      const response = await createDatabaseConnection(payload).unwrap();
      if (response.error.code == "error") {
        setErrorMessage(response.error.message);
      } else {
        handleClose();
      }
    } catch (error) {
      console.error("Failed to create database connection:", error);
    }
  };

  const initialValues = {
    connectionName: "",
    databaseType: "PostgreSQL",
    host: "",
    port: "",
    databaseName: "",
    username: "",
    password: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.connectionName) errors.connectionName = "Required";
    else if (!values.host) errors.host = "Required";
    else if (!values.port) errors.port = "Required";
    else if (!values.databaseName) errors.databaseName = "Required";
    else if (!values.username) errors.username = "Required";
    else if (!values.password) errors.password = "Required";
    return errors;
  };

  return (
    <>
      <Modal open={openNewConnectionForm} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "#1c1c1c",
            borderRadius: "10px",
            boxShadow: 24,
            p: 2,
            outline: "none",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 2, borderBottom: "1px solid #4b4545ff", pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 18 }}>
                Add Database Connection
              </Typography>
              <button
                onClick={handleClose}
                className="hover:bg-red-500/20 p-1 rounded-lg cursor-pointer"
              >
                <X color="#fff" />
              </button>
            </Box>
          </Box>

          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              await handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({
              isSubmitting,
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
            }) => (
              <Form>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {/* Connection Name */}
                  <Box>
                    <Field
                      as={TextField}
                      name="connectionName"
                      placeholder="Connection Name"
                      fullWidth
                      value={values.connectionName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={inputStyle}
                    />
                    {touched.connectionName && errors.connectionName && (
                      <Typography color="error" variant="caption">
                        {errors.connectionName}
                      </Typography>
                    )}
                  </Box>

                  {/* Database Type */}
                  <Box>
                    <Typography sx={labelStyle}>Database Type</Typography>
                    <Field
                      as={TextField}
                      name="databaseType"
                      select
                      fullWidth
                      value={values.databaseType}
                      onChange={handleChange}
                      sx={inputStyle}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: { bgcolor: "#2a2a2a", color: "#fff" },
                          },
                        },
                      }}
                    >
                      <MenuItem value="PostgreSQL">PostgreSQL</MenuItem>
                      <MenuItem value="MySQL">MySQL</MenuItem>
                    </Field>
                  </Box>

                  {/* Host + Port */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box sx={{ flex: 2 }}>
                      <Typography sx={labelStyle}>Host</Typography>
                      <Field
                        as={TextField}
                        name="host"
                        fullWidth
                        placeholder="Enter host"
                        value={values.host}
                        onChange={handleChange}
                        sx={inputStyle}
                      />
                      {touched.host && errors.host && (
                        <Typography color="error" variant="caption">
                          {errors.host}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography sx={labelStyle}>Port</Typography>
                      <Field
                        as={TextField}
                        name="port"
                        fullWidth
                        placeholder="Enter port"
                        value={values.port}
                        onChange={handleChange}
                        sx={inputStyle}
                      />
                      {touched.port && errors.port && (
                        <Typography color="error" variant="caption">
                          {errors.port}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Database Name */}
                  <Box>
                    <Typography sx={labelStyle}>Database Name</Typography>
                    <Field
                      as={TextField}
                      name="databaseName"
                      fullWidth
                      placeholder="Enter database name"
                      value={values.databaseName}
                      onChange={handleChange}
                      sx={inputStyle}
                    />
                    {touched.databaseName && errors.databaseName && (
                      <Typography color="error" variant="caption">
                        {errors.databaseName}
                      </Typography>
                    )}
                  </Box>

                  {/* Username */}
                  <Box>
                    <Typography sx={labelStyle}>Username</Typography>
                    <Field
                      as={TextField}
                      name="username"
                      fullWidth
                      placeholder="Enter username"
                      value={values.username}
                      onChange={handleChange}
                      sx={inputStyle}
                    />
                    {touched.username && errors.username && (
                      <Typography color="error" variant="caption">
                        {errors.username}
                      </Typography>
                    )}
                  </Box>

                  {/* Password */}
                  <Box>
                    <Typography sx={labelStyle}>Password</Typography>
                    <Field
                      as={TextField}
                      name="password"
                      type="password"
                      fullWidth
                      placeholder="Enter password"
                      value={values.password}
                      onChange={handleChange}
                      sx={inputStyle}
                    />
                    {touched.password && errors.password && (
                      <Typography color="error" variant="caption">
                        {errors.password}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Buttons */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={handleClose}
                    sx={{
                      bgcolor: "#2a2a2a",
                      color: "#fff",
                      textTransform: "none",
                      px: 2,
                      "&:hover": {
                        bgcolor: "#403f3fff",
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      textTransform: "none",
                      px: 3,
                      borderRadius: "6px",
                      "&:hover": {
                        bgcolor: "#265b97ff",
                      },
                    }}
                  >
                    Connect
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      {errorMessage && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
        >
          <Alert
            onClose={() => setErrorMessage("")}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default NewConnectionFormPop;
