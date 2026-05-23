"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import {
  verifyEmailAction,
  resendVerificationAction,
} from "@/app/(auth)/actions";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Resend code states
  const [resendEmail, setResendEmail] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (token && emailParam) {
      setVerifying(true);
      setError("");
      verifyEmailAction(token, emailParam).then((res) => {
        setVerifying(false);
        if (res?.error) {
          setError(res.error);
        } else {
          setSuccess(true);
          // Redirect to sign in after success
          setTimeout(() => {
            router.push("/sign-in");
          }, 3000);
        }
      });
    }
  }, [token, emailParam, router]);

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      setResendError("Please enter your email address.");
      return;
    }

    setResendError("");
    setResendSuccess("");

    startTransition(async () => {
      const res = await resendVerificationAction(resendEmail);
      if (res?.error) {
        setResendError(res.error);
      } else {
        setResendSuccess(
          "A new verification email has been sent! Please check your inbox.",
        );
        setResendEmail("");
      }
    });
  };

  if (verifying) {
    return (
      <div className="text-center py-6 space-y-4">
        <svg
          className="animate-spin h-10 w-10 text-blue-600 mx-auto"
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
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Verifying your email address, please wait...
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-6 space-y-4">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Email Verified!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your account is now active. Redirecting you to the sign-in page...
        </p>
        <Link
          href="/sign-in"
          className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 space-y-4">
        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Verification Failed
        </h2>
        <p className="text-red-500 text-sm font-medium">{error}</p>
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          The link may have expired or been consumed. Try requesting a new one
          below.
        </p>
      </div>
    );
  }

  // Verification request (no token/email parameters loaded)
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-full text-blue-600">
          <Mail className="h-12 w-12" />
        </div>
      </div>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        We've sent a verification link to your email. Click on the link to
        confirm your account.
      </p>

      <form
        onSubmit={handleResend}
        className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800/50"
      >
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Resend Verification Email
        </h3>
        <div>
          <input
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
            placeholder="name@example.com"
            required
            disabled={isPending}
          />
        </div>

        {resendError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-100 dark:border-red-900/50">
            {resendError}
          </div>
        )}

        {resendSuccess && (
          <div className="p-3 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs rounded-xl border border-green-100 dark:border-green-900/50">
            {resendSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 text-white font-semibold rounded-xl text-sm transition-all duration-150 flex items-center justify-center cursor-pointer border-none"
        >
          {isPending ? "Sending..." : "Resend Verification Email"}
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md p-8 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          Verify Email
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Confirm your account registration to unlock contributions
        </p>
      </div>

      <Suspense
        fallback={<div className="text-center py-4">Checking params...</div>}
      >
        <VerifyEmailForm />
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
