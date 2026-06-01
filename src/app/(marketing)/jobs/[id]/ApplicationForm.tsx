"use client";

import React, { useState } from "react";
import { submitJobApplication } from "@/features/jobs/actions";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const getAsString = (value: FormDataEntryValue | null): string =>
  typeof value === "string" ? value : "";

export default function ApplicationForm({ vacancyId }: { vacancyId: number }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      vacancyId,
      applicantName: getAsString(formData.get("applicantName")),
      applicantEmail: getAsString(formData.get("applicantEmail")),
      resumeUrl: getAsString(formData.get("resumeUrl")),
      coverLetter: getAsString(formData.get("coverLetter")),
    };

    try {
      await submitJobApplication(data);
      setStatus({
        type: "success",
        message: "Application submitted successfully!",
      });
      router.refresh();
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Failed to submit application. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          htmlFor="applicantName"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Full Name
        </label>
        <input
          type="text"
          id="applicantName"
          name="applicantName"
          required
          className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl bg-background text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:border-gray-800"
        />
      </div>

      <div>
        <label
          htmlFor="applicantEmail"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Email Address
        </label>
        <input
          type="email"
          id="applicantEmail"
          name="applicantEmail"
          required
          className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl bg-background text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:border-gray-800"
        />
      </div>

      <div>
        <label
          htmlFor="resumeUrl"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Resume Link (URL)
        </label>
        <input
          type="url"
          id="resumeUrl"
          name="resumeUrl"
          required
          placeholder="https://your-portfolio.com/resume.pdf"
          className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl bg-background text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:border-gray-800"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Please provide a link to your resume (Google Drive, Dropbox, Portfolio, etc.)
        </p>
      </div>

      <div>
        <label
          htmlFor="coverLetter"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Cover Letter (Optional)
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={5}
          className="w-full px-3.5 py-2.5 border border-gray-200/80 rounded-xl bg-background text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:border-gray-800"
        ></textarea>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
