// components/LoginPage.tsx
import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { Database } from "lucide-react"; // or your icon lib
import { useForgotPasswordMutation, useLoginMutation, useSignupMutation } from "../features/schema/baseQuery";
import AutoSlider from "./AutoSlider";
import LoginPanel from "./LoginPanel";
import SignUpPanel from "./SignUpPanel";
import ForgotPasswordPanel from "./ForgotPasswordPanel";
import { Snackbar, Alert } from "@mui/material";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading, error: signupError }] = useSignupMutation();
  const [forgotPassword, { isLoading: isForgotPasswordLoading, error: forgotPasswordError }] = useForgotPasswordMutation();
  const [panelType, setPanelType] = useState("login");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUsername("");
    setPassword("");
    setEmail("");
  }, [panelType]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const from = location.state?.from || "/";

  // Redirect if already logged in
  if (localStorage.getItem("authToken")) {
    return <Navigate to={from} replace />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ username, password }).unwrap();
      localStorage.setItem("authToken", result.token);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ username, email, password }).unwrap();
      showMessage("Account created successfully! Please login.", "success");
      setPanelType("login");
    } catch (err) {
      console.error("Signup failed:", err);
      const errorMsg = err?.data?.message || "Signup failed. Please try again.";
      showMessage(errorMsg, "error");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await forgotPassword({ email }).unwrap();
      showMessage(result.message || "Password reset link sent to your email", "success");
      setPanelType("login");
    } catch (err) {
      console.error("Forgot password failed:", err);
      const errorMsg = err?.data?.message || "Failed to process request. Please try again.";
      showMessage(errorMsg, "error");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900">
      <div className="flex flex-1 flex-row overflow-hidden">
        <div className="flex-1 bg-blue-700 overflow-hidden">
          <AutoSlider />
        </div>

        <div className="w-full max-w-md bg-white p-6 flex items-center justify-center">
          {panelType === "login" ? (
            <LoginPanel
              handleSubmit={handleLoginSubmit}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              isLoading={isLoginLoading}
              error={loginError}
              setPanelType={setPanelType}
            />
          ) : panelType === "signUp" ?(
            <SignUpPanel 
              handleSubmit={handleSignupSubmit}
              setPanelType={setPanelType}
              email={email}
              setEmail={setEmail}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              isLoading={isSignupLoading}
              error={signupError}
            />
          ):(
            <ForgotPasswordPanel
              handleSubmit={handleForgotPasswordSubmit}
              email={email}
              setEmail={setEmail}
              error={forgotPasswordError}
              setPanelType={setPanelType}
              isLoading={isForgotPasswordLoading}
            />
          )}
        </div>
      </div>

      <footer className="h-16 bg-gray-900 flex items-center justify-center shrink-0 border-t border-zinc-800">
        <p className="text-sm text-zinc-400">
          © 2026 artgoblin's Work • Smart DB Tool
        </p>
      </footer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
