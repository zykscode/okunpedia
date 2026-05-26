'use client';

import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition, useEffect } from 'react';
import { signUpAction } from '@/app/(auth)/actions';

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  // Password strength states
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('Weak');

  useEffect(() => {
    let score = 0;
    if (!password) {
      setStrengthScore(0);
      setStrengthLabel('None');
      return;
    }

    if (password.length >= 12) {
      score += 1;
    }
    if (/[A-Z]/u.test(password)) {
      score += 1;
    }
    if (/[a-z]/u.test(password)) {
      score += 1;
    }
    if (/[0-9]/u.test(password)) {
      score += 1;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/u.test(password)) {
      score += 1;
    }

    setStrengthScore(score);

    if (score <= 2) {
      setStrengthLabel('Weak');
    } else if (score === 3) {
      setStrengthLabel('Fair');
    } else if (score === 4) {
      setStrengthLabel('Strong');
    } else {
      setStrengthLabel('Very Strong');
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the Terms and Privacy Policy.');
      return;
    }

    setError('');
    setSuccess('');

    startTransition(async () => {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('acceptTerms', String(acceptTerms));

      const res = await signUpAction(formData);

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/sign-in?registered=true');
      }
    });
  };

  const getStrengthBarColor = () => {
    switch (strengthLabel) {
      case 'Weak': {
        return 'bg-red-500';
      }
      case 'Fair': {
        return 'bg-orange-500';
      }
      case 'Strong': {
        return 'bg-yellow-500';
      }
      case 'Very Strong': {
        return 'bg-green-500';
      }
      default: {
        return 'bg-gray-250';
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white/85 p-8 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/85">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Join Okunpedia to start contributing to our heritage
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-600 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
            placeholder="johndoe"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
            placeholder="name@example.com"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400"
          >
            Password
          </label>
          <div className="relative mb-2">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pr-11 pl-4 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
              placeholder="••••••••••••"
              required
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Strength:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {strengthLabel}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full ${getStrengthBarColor()} transition-all duration-300`}
                  style={{ width: `${(strengthScore / 5) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">
                Password should be 12+ characters, with uppercase, lowercase, numbers, and symbols.
              </p>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-xs font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400"
          >
            Confirm Password
          </label>
          <div className="relative mb-1">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pr-11 pl-4 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white"
              placeholder="••••••••••••"
              required
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <span className="text-xs text-red-500">Passwords do not match</span>
          )}
        </div>

        <div className="mt-4 flex items-start gap-3">
          <input
            id="acceptTerms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
            required
            disabled={isPending}
          />
          <label
            htmlFor="acceptTerms"
            className="text-xs leading-tight text-gray-500 dark:text-gray-400"
          >
            I accept the{' '}
            <Link href="/terms" className="font-semibold text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-semibold text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending || (confirmPassword !== '' && password !== confirmPassword)}
          className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-xl border-none bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/10 transition-all duration-150 hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-[0.99] disabled:bg-blue-400"
        >
          {isPending ? (
            <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
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
            'Sign Up'
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-gray-100 pt-6 text-center dark:border-gray-800/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
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
