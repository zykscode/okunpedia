import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  Heart,
  Sparkles,
  Users,
  Award,
  ShieldAlert,
  Mail,
  Map,
} from "lucide-react";

import { AppConfig } from "@/utils/AppConfig";

export const metadata: Metadata = {
  title: "Welcome to Okunpedia — Our Story & Vision",
  description:
    "Introducing Okunpedia, our foundation based on Mr. John Otitoju’s book, and our collaborative future.",
  openGraph: {
    title: "Welcome to Okunpedia — Our Story & Vision",
    description:
      "Introducing Okunpedia, our foundation based on Mr. John Otitoju’s book, and our collaborative future.",
    url: `${AppConfig.siteUrl}/welcome`,
    siteName: AppConfig.title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome to Okunpedia — Our Story & Vision",
    description:
      "Introducing Okunpedia, our foundation based on Mr. John Otitoju’s book, and our collaborative future.",
  },
};

export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-4">
      {/* Header */}
      <div className="border-b border-gray-200/80 pb-8 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="emerald">Welcome to Okunpedia</Badge>
          <Badge variant="purple">Foundational Story</Badge>
          <Badge variant="amber">Community Driven</Badge>
        </div>
        <h1 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Preserving the Heart of Okunland
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Introducing the digital repository for the Oworo, Bunu, Owe, Gbede,
          Ijumu, and Yagba peoples.
        </p>
      </div>

      {/* Hero / Inspiration Block */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 p-6 sm:p-8 dark:border-emerald-500/15 dark:from-emerald-950/20 dark:via-gray-900/60 dark:to-amber-950/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="flex items-start gap-4">
          <div className="hidden sm:inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
            <BookOpen className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Award className="size-4 text-amber-500" />
              <span className="text-xs font-semibold tracking-wider text-amber-800 uppercase dark:text-amber-400">
                Foundational Inspiration
              </span>
            </div>
            <h2 className="mt-1 font-serif text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">
              An Inspired Tribute to Mr. John Otitoju
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
              The historical foundations and initial community profiles on
              Okunpedia are based directly on the groundbreaking book,{" "}
              <strong className="text-emerald-700 dark:text-emerald-400">
                “The Okun People”
              </strong>{" "}
              by{" "}
              <strong className="text-gray-900 dark:text-white">
                Mr. John Otitoju
              </strong>
              .
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
              His book was a profound inspiration to us decades ago, serving as
              a beacon of cultural identity and heritage. We hold deep gratitude
              for his dedication to documenting the stories of our ancestors.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Notice Alert */}
      <div className="rounded-xl border border-amber-500/25 bg-amber-50/30 p-5 dark:border-amber-500/20 dark:bg-amber-950/15">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400">
              Copyright & Attribution
            </h3>
            <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-500">
              Please note that{" "}
              <strong className="font-semibold">
                Mr. John Otitoju holds the copyright
              </strong>{" "}
              to the foundational texts, historical monographs, and accounts
              regarding the communities and towns represented on this site.
              Okunpedia hosts this information for community-driven educational
              purposes, acknowledging his intellectual ownership with the utmost
              respect.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Collaboration Model */}
      <section className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">
          A Living, Evolving Platform
        </h3>
        <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          While Mr. Otitoju’s book provides our bedrock, history is also written
          in the present. Okunpedia is designed to be a collaborative space:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="mb-2 flex items-center gap-2 font-serif text-base font-bold text-gray-950 dark:text-white">
              <Users className="size-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>Real-Time Collaboration</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              All community records are subject to updates, corrections, and
              refinements. We invite community historians, elders, and youth
              across Okunland and the diaspora to join hands and curate our
              narratives together.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="mb-2 flex items-center gap-2 font-serif text-base font-bold text-gray-950 dark:text-white">
              <Sparkles className="size-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>Modernizing Oral Archives</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              By translating paper manuscripts and oral recordings into a
              digital system, we safeguard our cultural assets from decay and
              physical loss.
            </p>
          </div>
        </div>
      </section>

      {/* Future Roadmap */}
      <section className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">
          What is Coming Next
        </h3>
        <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          We are building beyond a static encyclopedia. Our roadmap includes
          features to directly support community development and unity:
        </p>
        <div className="mt-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold">
              1
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-gray-950 dark:text-white">
                Community Reports & Civic Metrics
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Tracking municipal parameters, local needs, infrastructure
                status, and self-help developmental updates directly on each
                town’s page.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold">
              2
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-gray-950 dark:text-white">
                Role Modelling Index
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Showcasing the achievements and life paths of illustrious sons
                and daughters of Okunland who serve as models of integrity and
                service.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold">
              3
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-gray-950 dark:text-white">
                Mentorship Connections
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Bridging the gap between students, young professionals, and
                experienced mentors within our global community to foster job
                readiness and skills transfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gratitude & Action Contact */}
      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/60">
        <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2">
          <Heart className="size-4.5 text-rose-500 fill-rose-500" />
          Help Us Connect & Appreciate
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          We would love to formally contact Mr. John Otitoju, present this
          project to him, and find ways to appreciate his contribution more
          deeply. If you have contact information for him, his family, or his
          representatives, please reach out to us.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="mailto:okunpedia@gmail.com?subject=Contacting Mr. John Otitoju"
            className="inline-block focus:outline-hidden"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <Mail className="size-3.5" />
              Contact Administration
            </Button>
          </a>
        </div>
      </section>

      {/* CTAs */}
      <div className="flex flex-col gap-3 border-t border-gray-200/80 pt-8 sm:flex-row dark:border-gray-800">
        <Link href="/communities" className="focus:outline-hidden">
          <Button variant="primary" size="lg" className="gap-2">
            Explore Okun Communities
            <Map className="size-4" />
          </Button>
        </Link>
        <Link href="/" className="focus:outline-hidden">
          <Button variant="outline" size="lg">
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
