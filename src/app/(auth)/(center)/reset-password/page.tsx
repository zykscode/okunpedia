"use client";

import React, { useState, useTransition, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordAction } from "@/app/(auth)/actions";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Weak");

  useEffect(() => {
    let score = 0;
    if (!password) {
      setStrengthScore(0);
      setStrengthLabel("None");
      return;
    }

    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    setStrengthScore(score);

    if (score <= 2) {
      setStrengthLabel("Weak");
    } else if (score === 3) {
      setStrengthLabel("Fair");
    } else if (score === 4) {
      setStrengthLabel("Strong");
    } else {
      setStrengthLabel("Very Strong");
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset link.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      const res = await resetPasswordAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(
          "Your password has been successfully reset! Redirecting to sign in...",
        );
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      }
    });
  };

  const getStrengthBarColor = () => {
    switch (strengthLabel) {
      case "Weak":
        return "bg-red-500";
      case "Fair":
        return "bg-orange-500";
      case "Strong":
        return "bg-yellow-500";
      case "Very Strong":
        return "bg-green-500";
      default:
        return "bg-gray-250";
    }
  };

  if (!token) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">Invalid or expired reset token.</p>
        <Link
          href="/forgot-password"
          className="text-blue-600 font-semibold hover:underline"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
          New Password
        </label>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="••••••••••••"
            required
            disabled={isPending || success !== ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {password && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Strength:</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {strengthLabel}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthBarColor()} transition-all duration-300`}
                style={{ width: `${(strengthScore / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
          Confirm New Password
        </label>
        <div className="relative mb-1">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            placeholder="••••••••••••"
            required
            disabled={isPending || success !== ""}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <span className="text-xs text-red-500">Passwords do not match</span>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-sm rounded-xl border border-green-100 dark:border-green-900/50">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={
          isPending ||
          success !== "" ||
          (confirmPassword !== "" && password !== confirmPassword)
        }
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
          "Reset Password"
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md p-8 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          Choose New Password
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter and confirm your new secure account password
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-4">Loading token verification...</div>
        }
      >
        <ResetPasswordForm />
      </Suspense>

      <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800/50 pt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Back to{" "}
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
