// components/LoginPage.tsx
import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { Database } from "lucide-react"; // or your icon lib
import { useLoginMutation, useSignupMutation } from "../features/schema/baseQuery";
import AutoSlider from "./AutoSlider";
import LoginPanel from "./LoginPanel";
import SignUpPanel from "./SignUpPanel";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading, error: signupError }] = useSignupMutation();
  const [panelType, setPanelType] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUsername("");
    setPassword("");
    setEmail("");
  }, [panelType]);

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
      setPanelType("login");
    } catch (err) {
      console.error("Signup failed:", err);
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
          ) : (
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
          )}
        </div>
      </div>

      <footer className="h-16 bg-gray-900 flex items-center justify-center shrink-0 border-t border-zinc-800">
        <p className="text-sm text-zinc-400">
          © 2026 artgoblin's Work • Smart DB Tool
        </p>
      </footer>
    </div>
  );
};
