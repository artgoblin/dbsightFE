import { Database } from "lucide-react";

const ForgotPasswordPanel = ({
    handleSubmit,
    email,
    setEmail,
    error,
    setPanelType,
    isLoading
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <Database className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-bold italic text-zinc-900">DBSight</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {"data" in error
              ? error.data?.message || "Invalid credentials"
              : "Connection error"}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-800 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-100 border border-zinc-600 rounded-lg text-zinc-900 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className=" flex justify-between items-center flex-col mt-4">
        <button
          onClick={() => setPanelType("login")}
          className="text-sm text-blue-600 hover:underline focus:outline-none cursor-pointer"
        >
          Back to Login
        </button>
      </div>

      <p className="text-xs text-zinc-500 mt-4 text-center">
        Secure access to your data workspace
      </p>
    </div>
  );
};

export default ForgotPasswordPanel;
