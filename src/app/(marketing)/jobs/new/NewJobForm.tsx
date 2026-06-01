"use client";

import React, { useState } from "react";
import { createJobVacancy } from "@/features/jobs/actions";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const getAsString = (value: FormDataEntryValue | null): string =>
  typeof value === "string" ? value : "";

export default function NewJobForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      title: getAsString(formData.get("title")),
      description: getAsString(formData.get("description")),
      location: getAsString(formData.get("location")),
      type: getAsString(formData.get("type")),
      authorId: userId,
    };

    try {
      const vacancy = await createJobVacancy(data);
      if (vacancy) {
        setStatus({
          type: "success",
          message: "Job vacancy posted successfully! Redirecting...",
        });
        setTimeout(() => {
          router.push(`/jobs/${vacancy.id}`);
        }, 1500);
      } else {
        setStatus({
          type: "error",
          message: "Failed to post vacancy. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-card border rounded-2xl p-6 md:p-8 shadow-xs"
    >
      <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
        Post a New Vacancy
      </h2>

      {status && (
        <div
          className={`p-4 rounded-xl border text-sm ${
            status.type === "success"
              ? "bg-emerald-50 border-emerald-500/20 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-500/10 dark:text-emerald-400"
              : "bg-red-50 border-red-500/20 text-red-800 dark:bg-red-950/20 dark:border-red-500/10 dark:text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Job Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl bg-background text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:border-gray-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g. Remote, Lagos, Kabba"
            className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl bg-background text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:border-gray-800"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Job Type
          </label>
          <select
            id="type"
            name="type"
            className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl bg-background text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:border-gray-800"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Volunteer">Volunteer</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Job Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={8}
          className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl bg-background text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:border-gray-800"
        ></textarea>
      </div>

      <div className="flex gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            router.back();
          }}
          disabled={loading}
          className="w-1/3"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Posting..." : "Post Vacancy"}
        </Button>
      </div>
    </form>
  );
}
