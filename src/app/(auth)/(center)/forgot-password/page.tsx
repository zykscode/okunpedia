"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/(auth)/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setSuccess("");

    startTransition(async () => {
      const res = await forgotPasswordAction(email);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(
          "If an account exists with that email, we have sent a password reset link.",
        );
        setEmail("");
      }
    });
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email to receive a password reset link
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-sm rounded-xl border border-green-100 dark:border-green-900/50">
          {success}
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              placeholder="name@example.com"
              required
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center cursor-pointer border-none"
          >
            {isPending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      )}

      <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800/50 pt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-150"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
