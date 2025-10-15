"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api";
import toast from "react-hot-toast";

interface LoginFormProps {
  onToggleForm?: () => void;
}

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.signIn(email, password);
      toast.success("Login successful!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>

      {/* {onToggleForm && (
        <div className="text-center">
          <button
            type="button"
            onClick={onToggleForm}
            className="text-primary-600 hover:text-primary-500 text-sm"
          >
            Don't have an account? Sign up
          </button>
        </div>
      )} */}
    </form>
  );
}
