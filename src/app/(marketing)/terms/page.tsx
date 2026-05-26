import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — Okunpedia',
  description: 'Terms of Service governing the use of Okunpedia digital heritage platform.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-4">
      {/* Header */}
      <div className="border-b border-gray-200/80 pb-8 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Legal Framework</Badge>
          <Badge variant="amber">Last Updated: May 2026</Badge>
        </div>
        <h1 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Governing the use of Okunpedia platform and community submissions.
        </p>
      </div>

      {/* Overview Block */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-50 to-emerald-50/20 p-6 dark:border-blue-500/15 dark:from-blue-950/30 dark:to-emerald-950/20">
        <div className="flex items-start gap-3">
          <Scale className="mt-1 size-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              Platform Commitment
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Welcome to Okunpedia. By accessing or using our services, registering as a contributor,
              or viewing the heritage profiles, you agree to comply with and be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            1. User Contributions & Licensing
          </h3>
          <p>
            Okunpedia is a community-driven repository. All information, documentation, monographs, 
            and multimedia uploaded to Okunpedia by users must be accurate, historically faithful, and 
            free from proprietary copyright claims.
          </p>
          <p>
            By submitting material, you grant Okunpedia a perpetual, worldwide, non-exclusive, 
            royalty-free license to use, display, distribute, and preserve the information for educational 
            and heritage purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            2. Contributor Guidelines
          </h3>
          <p>
            Contributors are expected to adhere to constructive, respectful, and academically sound principles.
            Submitting defamatory content, spam, speculative accounts, or unverified claims is strictly 
            prohibited and may result in account termination.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            3. Disclaimer of Liability
          </h3>
          <p>
            Content on Okunpedia is provided "as is" for informational and archival purposes only. While we 
            strive to ensure historical accuracy through administrative reviews, Okunpedia does not warrant the 
            absolute correctness of community-generated monographs.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
            4. Service Modifications
          </h3>
          <p>
            We reserve the right to modify, suspend, or terminate the platform at any time, including restricting 
            access to curation dashboards and administrative privileges as outlined in our user permissions.
          </p>
        </section>
      </div>

      {/* Footer / Contact */}
      <div className="flex flex-col gap-3 border-t border-gray-200/80 pt-8 sm:flex-row dark:border-gray-800">
        <Link href="/privacy" className="focus:outline-hidden">
          <Button variant="primary" size="lg">
            Privacy Policy
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
