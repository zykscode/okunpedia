import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Okunpedia',
  description: 'Privacy Policy outlining data collection, storage, and privacy practices for Okunpedia.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-4">
      {/* Header */}
      <div className="border-b border-gray-200/80 pb-8 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Data Protection</Badge>
          <Badge variant="amber">Last Updated: May 2026</Badge>
        </div>
        <h1 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Explaining how we protect, store, and utilize your account details.
        </p>
      </div>

      {/* Overview Block */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 to-amber-50/20 p-6 dark:border-emerald-500/15 dark:from-emerald-950/30 dark:to-amber-950/20">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 size-5 text-emerald-700 dark:text-emerald-400" />
          <div>
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              Privacy Promise
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              We respect your privacy. This Privacy Policy details the types of personal data we collect, 
              how it is used to authenticate contributors, and the measures we employ to secure it.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            1. Information We Collect
          </h3>
          <p>
            When you register for an account on Okunpedia to submit historical entries, we collect your 
            username, email address, and a securely hashed password. These credentials are used solely 
            for authentication and attribution of submissions.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            2. Data Security
          </h3>
          <p>
            We implement industry-standard database protections and secure connection protocols. Our passwords 
            are hashed using bcrypt to prevent unauthorized access. We do not share, sell, or rent your 
            personal details with third-party advertising companies.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            3. Cookies & Local Storage
          </h3>
          <p>
            Okunpedia uses cookies and browser session parameters exclusively to keep you authenticated 
            and coordinate access permissions across dashboard sessions.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            4. Access & Rectification
          </h3>
          <p>
            You can modify your profile information at any time via the user configuration dashboards. If you 
            wish to request deletion of your account and associated public profile, please contact our support team.
          </p>
        </section>
      </div>

      {/* Footer / Contact */}
      <div className="flex flex-col gap-3 border-t border-gray-200/80 pt-8 sm:flex-row dark:border-gray-800">
        <Link href="/terms" className="focus:outline-hidden">
          <Button variant="primary" size="lg">
            Terms of Service
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </Link>
        <Link href="/sign-in" className="focus:outline-hidden">
          <Button variant="outline" size="lg">
            Back to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
