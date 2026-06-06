import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, BookOpen, Users, Globe, Target } from "lucide-react";

import { AppConfig } from "@/utils/AppConfig";

export const metadata: Metadata = {
  title: "About Okunpedia — Digital Heritage Platform",
  description:
    "Learn about our foundational framework dedicated to preserving the cultural histories, dialects, migration routes, and development metrics of the Okun communities in Kogi State, Nigeria.",
  openGraph: {
    title: "About Okunpedia — Digital Heritage Platform",
    description:
      "Learn about our foundational framework dedicated to preserving the cultural histories, dialects, migration routes, and development metrics of the Okun communities in Kogi State, Nigeria.",
    url: `${AppConfig.siteUrl}/about`,
    siteName: AppConfig.title,
    images: [
      {
        url: `${AppConfig.siteUrl}/static/images/hero-bg.jpg`,
        width: 1200,
        height: 630,
        alt: "About Okunpedia",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Okunpedia — Digital Heritage Platform",
    description:
      "Learn about our foundational framework dedicated to preserving the cultural histories, dialects, migration routes, and development metrics of the Okun communities in Kogi State, Nigeria.",
    images: [`${AppConfig.siteUrl}/static/images/hero-bg.jpg`],
  },
};

const pillars = [
  {
    icon: BookOpen,
    title: "Cultural Preservation",
    description:
      "Digitising oral traditions, folklore, and ancestral migration chronicles before they are lost to time.",
  },
  {
    icon: Globe,
    title: "Geographic Documentation",
    description:
      "Mapping the physical, political, and historical boundaries of all Okun sub-groups and LGA territories.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description:
      "Built and maintained by Okun indigenes worldwide — anyone can contribute records, corrections, and new profiles.",
  },
  {
    icon: Target,
    title: "Civic Accountability",
    description:
      "Tracking infrastructure gaps and development metrics to empower community advocacy and self-help initiatives.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-4">
      {/* Header */}
      <div className="border-b border-gray-200/80 pb-8 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Civic Initiative</Badge>
          <Badge variant="amber">Digital Preservation</Badge>
        </div>
        <h1 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          About Okunpedia
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Documenting the lineages, history, and civic indicators of Okunland
          for future generations.
        </p>
      </div>

      {/* Body */}
      <div className="space-y-6 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
        <p>
          Okunpedia functions as a definitive digital archival space built to
          capture, authenticate, and showcase the extensive pre-colonial oral
          histories, migration lineages, linguistic boundaries, and continuous
          infrastructural milestones of the Okun people across Kogi State.
        </p>
        <p>
          Encompassing key local government areas including Kabba/Bunu, Ijumu,
          Mopa-Muro, Yagba East, and Yagba West, the platform enables
          researchers, community members, and civic developers to access
          transparent records on traditional monarchical structures, prominent
          historical actors, and localised developmental parameters.
        </p>
      </div>

      {/* Mission */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 to-amber-50/30 p-6 dark:border-emerald-500/15 dark:from-emerald-950/30 dark:to-amber-950/20">
        <p className="mb-2 text-xs font-semibold tracking-widest text-emerald-700 uppercase dark:text-emerald-400">
          Mission Statement
        </p>
        <p className="font-serif text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
          Zero historical attrition of traditional Okun heritage.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          We are committed to ensuring no oral tradition, dialectical folklore,
          or municipal record of the Okun people is lost — while accelerating
          cross-community infrastructural awareness and self-advocacy.
        </p>
      </div>

      {/* Pillars */}
      <section aria-labelledby="pillars-heading">
        <h2
          id="pillars-heading"
          className="font-serif text-xl font-bold text-gray-900 dark:text-white sm:text-2xl"
        >
          Our Four Pillars
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60"
            >
              <div className="mb-3 inline-flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <pillar.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white">
                {pillar.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="flex flex-col gap-3 border-t border-gray-200/80 pt-8 sm:flex-row dark:border-gray-800">
        <Link href="/communities" className="focus:outline-hidden">
          <Button variant="primary" size="lg">
            Explore Communities
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </Link>
        <a href="mailto:okunpedia@gmail.com" className="focus:outline-hidden">
          <Button variant="outline" size="lg">
            Get in Touch
          </Button>
        </a>
      </div>
    </div>
  );
}
