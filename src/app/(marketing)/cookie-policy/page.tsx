import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Cookie, ShieldCheck, Eye, ToggleLeft } from "lucide-react";

import { AppConfig } from "@/utils/AppConfig";

export const metadata: Metadata = {
  title: "Cookie Policy — Okunpedia",
  description:
    "Cookie Policy explaining how Okunpedia uses cookies and local storage to run the platform.",
  openGraph: {
    title: "Cookie Policy — Okunpedia",
    description:
      "Cookie Policy explaining how Okunpedia uses cookies and local storage to run the platform.",
    url: `${AppConfig.siteUrl}/cookie-policy`,
    siteName: AppConfig.title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy — Okunpedia",
    description:
      "Cookie Policy explaining how Okunpedia uses cookies and local storage to run the platform.",
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-4">
      {/* Header */}
      <div className="border-b border-gray-200/80 pb-8 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Privacy Controls</Badge>
          <Badge variant="amber">Last Updated: June 2026</Badge>
        </div>
        <h1 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Cookie Policy
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Explaining how and why we use cookies and browser storage
          technologies.
        </p>
      </div>

      {/* Overview Block */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 to-amber-50/20 p-6 dark:border-emerald-500/15 dark:from-emerald-950/30 dark:to-amber-950/20">
        <div className="flex items-start gap-3">
          <Cookie className="mt-1 size-5 text-emerald-750 dark:text-emerald-400" />
          <div>
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              Respecting Your Digital Space
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Okunpedia uses minimal browser cookies and local storage to keep
              you securely signed in, remember your preferences, and gather
              basic analytics to improve the platform experience. We never sell
              your data or use advertising trackers.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            1. What Are Cookies?
          </h3>
          <p>
            Cookies are small text files stored on your computer or mobile
            device when you visit a website. They allow the website to recognize
            your device and store information about your preferences or past
            actions. We also utilize local storage (localStorage and
            sessionStorage) within your browser to save configuration state and
            enhance layout responsiveness.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            2. How We Use Cookies & Local Storage
          </h3>
          <p>
            We use these technologies for the following essential and
            operational purposes:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
              <div className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span>Essential & Security</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                To manage authenticated contributor sessions, verify requests,
                prevent Cross-Site Request Forgery (CSRF), and keep you secure
                while editing.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
              <div className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <ToggleLeft className="size-4 text-emerald-500" />
                <span>User Preferences</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                To store settings such as dark mode preference, whether you have
                closed the initial introductory welcome screen, and your cookie
                consent settings.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
              <div className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Eye className="size-4 text-emerald-500" />
                <span>Performance & Analytics</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                To understand visitor patterns via high-performance
                privacy-preserving Vercel Analytics, helping us identify site
                errors and performance issues.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            3. Detailed Cookie Inventory
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200/80 dark:divide-gray-800 text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    Purpose
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    Type
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-250 dark:divide-gray-800 bg-white dark:bg-gray-950">
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-gray-950 dark:text-white">
                    __Secure-next-auth.session-token
                  </td>
                  <td className="px-4 py-3">
                    Stores session information for logged-in users.
                  </td>
                  <td className="px-4 py-3">Essential</td>
                  <td className="px-4 py-3">Session / 30 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-gray-950 dark:text-white">
                    theme
                  </td>
                  <td className="px-4 py-3">
                    Remembers light/dark color theme preference.
                  </td>
                  <td className="px-4 py-3">Preference (Local Storage)</td>
                  <td className="px-4 py-3">Persistent</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-gray-950 dark:text-white">
                    okunpedia_cookie_consent
                  </td>
                  <td className="px-4 py-3">
                    Remembers your cookie consent selection.
                  </td>
                  <td className="px-4 py-3">Preference (Local Storage)</td>
                  <td className="px-4 py-3">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-bold text-gray-950 dark:text-white">
                    okunpedia_welcome_seen
                  </td>
                  <td className="px-4 py-3">
                    Records that you have viewed the one-time welcome
                    introduction screen.
                  </td>
                  <td className="px-4 py-3">Preference (Local Storage)</td>
                  <td className="px-4 py-3">Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            4. Managing & Controlling Your Cookie Settings
          </h3>
          <p>
            You have the right to decide whether to accept or reject
            non-essential cookies. You can adjust your choices via our Consent
            Banner on your first visit, or change your browser settings to
            delete existing cookies and block new ones.
          </p>
          <p>
            Please note that blocking essential cookies may disrupt access to
            authentication dashboards and curation workflows.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            5. Contact Us
          </h3>
          <p>
            If you have any questions or feedback about our use of cookies and
            local storage technologies, please email the administrator team at:{" "}
            <a
              href="mailto:hello@okunpedia.ng"
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              hello@okunpedia.ng
            </a>
            .
          </p>
        </section>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col gap-3 border-t border-gray-200/80 pt-8 sm:flex-row dark:border-gray-800">
        <Link href="/privacy" className="focus:outline-hidden">
          <Button variant="primary" size="lg">
            Privacy Policy
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </Link>
        <Link href="/" className="focus:outline-hidden">
          <Button variant="outline" size="lg">
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
