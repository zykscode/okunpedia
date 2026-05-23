"use client";

import React, { useState, useTransition, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updateSecuritySettingsAction } from "@/app/(auth)/actions";

export default function SecuritySettingsForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("Weak");

  useEffect(() => {
    let score = 0;
    if (!newPassword) {
      setStrengthScore(0);
      setStrengthLabel("None");
      return;
    }

    if (newPassword.length >= 12) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) score += 1;

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
  }, [newPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmNewPassword", confirmNewPassword);

      const res = await updateSecuritySettingsAction(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
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
        return "bg-gray-200";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
            placeholder="••••••••"
            required
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showCurrent ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
          New Password
        </label>
        <div className="relative mb-2">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
            placeholder="••••••••••••"
            required
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showNew ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {newPassword && (
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
            type={showConfirm ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
            placeholder="••••••••••••"
            required
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {confirmNewPassword && newPassword !== confirmNewPassword && (
          <span className="text-xs text-red-500">
            New passwords do not match
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={
          isPending ||
          (confirmNewPassword !== "" && newPassword !== confirmNewPassword)
        }
        className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center cursor-pointer border-none"
      >
        {isPending ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
