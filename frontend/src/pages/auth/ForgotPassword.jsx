import { useState } from "react";
import { Input } from "../../shared/ui/atoms/Input";
import { Button } from "../../shared/ui/atoms/Button";
import api from "../../shared/services/api";

const ForgotPassword = () => {
  const [companyId, setCompanyId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { companyId, userEmail });
      setMessage(res.data?.message || "If the email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to request password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password</h1>
        <p className="text-slate-600 dark:text-slate-400">We will email you a reset link.</p>
      </div>

      {message && (
        <div className="mb-6 p-3 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-lg text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="companyId"
          label="Company ID"
          type="text"
          placeholder="Enter your company ID"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          required
        />
        <Input
          id="userEmail"
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
