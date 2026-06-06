import type { Metadata } from "next";
import { Env } from "@/libs/Env";
import { AppConfig } from "@/utils/AppConfig";

export const metadata: Metadata = {
  title: "Share Feedback & Suggestions — Okunpedia",
  description:
    "Provide comments, report issues, or suggest improvements to help us preserve the rich history and heritage of Okunland.",
  openGraph: {
    title: "Share Feedback & Suggestions — Okunpedia",
    description:
      "Provide comments, report issues, or suggest improvements to help us preserve the rich history and heritage of Okunland.",
    url: `${AppConfig.siteUrl}/feedback`,
    siteName: AppConfig.title,
    type: "website",
  },
};

const DEFAULT_FEEDBACK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfdyCXHVfWFlzqBhJmsg4TZdSkCYbNldNR5rRVOAGh_0PtXZg/viewform?embedded=true";

export default function FeedbackPage() {
  const formUrl = Env.NEXT_PUBLIC_FEEDBACK_FORM_URL || DEFAULT_FEEDBACK_URL;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="border-b border-gray-200/80 pb-6 dark:border-gray-800">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Feedback & Suggestions
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Help us improve Okunpedia. Share your thoughts, report issues, or
          suggest new community records.
        </p>
      </div>

      {/* Info Notice card */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 to-amber-50/30 p-6 dark:border-emerald-500/15 dark:from-emerald-950/30 dark:to-amber-950/20">
        <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
          We want to hear from you!
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Whether you found a typo, have suggestions on historical community
          boundaries, or want to contribute oral lineage records, please use the
          form below to let us know. Your feedback helps us shape Okunpedia to
          be a more accurate resource for all Okun people.
        </p>
      </div>

      {/* Embedded Form */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-950 min-h-[750px]">
        <iframe
          src={formUrl}
          width="100%"
          height="800"
          className="border-0 w-full"
          title="Feedback Google Form"
          allowFullScreen
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}
