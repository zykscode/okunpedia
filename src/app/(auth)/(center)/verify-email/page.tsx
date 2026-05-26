// oxlint-disable typescript/no-confusing-void-expression
// oxlint-disable typescript/no-floating-promises
'use client';

import { CheckCircle2, XCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { verifyEmailAction, resendVerificationAction } from '@/app/(auth)/actions';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const emailParam = searchParams.get('email') ?? '';

  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Resend code states
  const [resendEmail, setResendEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendError, setResendError] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (token && emailParam) {
      setVerifying(true);
      setError('');
      verifyEmailAction(token, emailParam).then((res) => {
        setVerifying(false);
        if (res?.error) {
          setError(res.error);
        } else {
          setSuccess(true);
          // Redirect to sign in after success
          setTimeout(() => {
            router.push('/sign-in');
          }, 3000);
        }
      });
    }
  }, [token, emailParam, router]);

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      setResendError('Please enter your email address.');
      return;
    }

    setResendError('');
    setResendSuccess('');

    startTransition(async () => {
      const res = await resendVerificationAction(resendEmail);
      if (res?.error) {
        setResendError(res.error);
      } else {
        setResendSuccess('A new verification email has been sent! Please check your inbox.');
        setResendEmail('');
      }
    });
  };

  if (verifying) {
    return (
      <div className="space-y-4 py-6 text-center">
        <svg
          className="mx-auto h-10 w-10 animate-spin text-blue-600"
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
        <p className="font-medium text-gray-600 dark:text-gray-400">
          Verifying your email address, please wait...
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4 py-6 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Verified!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your account is now active. Redirecting you to the sign-in page...
        </p>
        <Link
          href="/sign-in"
          className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-blue-700"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 py-6 text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Failed</h2>
        <p className="text-sm font-medium text-red-500">{error}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          The link may have expired or been consumed. Try requesting a new one below.
        </p>
      </div>
    );
  }

  // Verification request (no token/email parameters loaded)
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-950/20">
          <Mail className="h-12 w-12" />
        </div>
      </div>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        We've sent a verification link to your email. Click on the link to confirm your account.
      </p>

      <form
        onSubmit={handleResend}
        className="space-y-4 border-t border-gray-100 pt-4 dark:border-gray-800/50"
      >
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Resend Verification Email
        </h3>
        <div>
          <input
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
            placeholder="name@example.com"
            required
            disabled={isPending}
          />
        </div>

        {resendError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {resendError}
          </div>
        )}

        {resendSuccess && (
          <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-xs text-green-600 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
            {resendSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full cursor-pointer items-center justify-center rounded-xl border-none bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-gray-800 disabled:bg-gray-400 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isPending ? 'Sending...' : 'Resend Verification Email'}
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white/85 p-8 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/85">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Verify Email
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Confirm your account registration to unlock contributions
        </p>
      </div>

      <Suspense fallback={<div className="py-4 text-center">Checking params...</div>}>
        <VerifyEmailForm />
      </Suspense>

      <div className="mt-8 border-t border-gray-100 pt-6 text-center dark:border-gray-800/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Back to{' '}
          <Link
            href="/sign-in"
            className="font-semibold text-blue-600 transition-colors duration-150 hover:text-blue-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
