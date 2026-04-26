import {
  Box,
  Button,
  colors,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { X } from "lucide-react";
import { useState } from "react";
import { useSaveQueryMutation, useUpdateQueryMutation } from "../features/schema/queryExecutionApi";

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
  fontSize: "14px",
  color: "#aaa",
  marginBottom: "6px",
  fontWeight: 500,
};

const SaveQueryFormPop = ({
  openSaveQueryModal,
  setOpenSaveQueryModal,
  initialValues,
  modalTitleRef,
}) => {
  const [saveQuery] = useSaveQueryMutation();
  const [updateQuery] = useUpdateQueryMutation();
  const handleClose = () => setOpenSaveQueryModal(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values) => {
    try {
      const payload = {
        database_name: values.databaseName,
        query: values.query,
        title: values.title,
        description: values.description,
      };
      const response =
        modalTitleRef.slice(0, 4) === "Save"
          ? await saveQuery(payload).unwrap()
          : await updateQuery({id:values.id,data:payload}).unwrap();
      if (response.error?.code == "error") {
        setErrorMessage(response.error.message);
      } else {
        handleClose();
      }
    } catch (error) {
      console.error("Failed to create database connection:", error);
    }
  };


  const validate = (values) => {
    const errors = {};
    if (!values.databaseName) errors.databaseName = "Required";
    else if (!values.query) errors.query = "Required";
    else if (!values.title) errors.title = "Required";
    else if (!values.description) errors.description = "Required";
    return errors;
  };

  return (
    <>
      <Modal open={openSaveQueryModal} onClose={handleClose}>
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
                {modalTitleRef}
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
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box sx={{ flex: 2 }}>
                      <Box>
                        <Typography sx={labelStyle}>Title</Typography>
                        <Field
                          as={TextField}
                          name="title"
                          fullWidth
                          placeholder="Enter title"
                          value={values.title}
                          onChange={handleChange}
                          sx={inputStyle}
                        />
                        {touched.title && errors.title && (
                          <Typography color="error" variant="caption">
                            {errors.title}
                          </Typography>
                        )}
                      </Box>
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
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box sx={{ flex: 2 }}>
                      <Typography sx={labelStyle}>Query</Typography>
                      <Field
                        as={TextField}
                        name="query"
                        fullWidth
                        multiline
                        minRows={6}
                        maxRows={5}
                        placeholder="Enter query"
                        value={values.query}
                        onChange={handleChange}
                        sx={{
                          ...inputStyle,
                          "& .MuiInputBase-input": {
                            fontFamily: "monospace",
                            whiteSpace: "pre", 
                            fontSize: "14px",
                            color: "#fff",
                          },
                        }}
                      />
                      {touched.query && errors.query && (
                        <Typography color="error" variant="caption">
                          {errors.query}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box>
                    <Typography sx={labelStyle}>Description</Typography>
                    <Field
                      as={TextField}
                      name="description"
                      fullWidth
                      placeholder="Enter description"
                      value={values.description}
                      onChange={handleChange}
                      sx={inputStyle}
                    />
                    {touched.description && errors.description && (
                      <Typography color="error" variant="caption">
                        {errors.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

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
                      bgcolor: "#0b4514ff",
                      textTransform: "none",
                      px: 3,
                      borderRadius: "6px",
                      "&:hover": {
                        bgcolor: "#096e18ff",
                      },
                    }}
                  >
                    {modalTitleRef.slice(0, 4)}
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

export default SaveQueryFormPop;
