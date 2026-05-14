import type { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'About Okunpedia - Digital Heritage Platform',
  description:
    'Learn about our foundational framework dedicated to preserving the cultural histories, dialects, migration routes, and municipal development metrics of the Okun communities.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div className="border-b border-gray-200 pb-6 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Civic Initiative</Badge>
          <Badge variant="amber">Digital Preservation</Badge>
        </div>
        <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          About Okunpedia
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Documenting the lineages, history, and civic indicators of Okunland.
        </p>
      </div>

      <div className="prose prose-emerald dark:prose-invert max-w-none space-y-4 text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <p>
          Okunpedia functions as a definitive digital archival space built to capture, authenticate, and showcase the extensive pre-colonial oral histories, migration lineages, linguistic boundaries, and continuous infrastructural milestones of the Okun people across Kogi State.
        </p>

        <p>
          Encompassing key local government areas including Kabba/Bunu, Ijumu, Lokoja, Mopa-Muro, Yagba East, and Yagba West, the platform enables researchers, community members, and civic developers to access transparent records on traditional monarchical structures, prominent historical actors, and localized developmental parameters.
        </p>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-5 text-xs text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-300 sm:text-sm">
          <strong className="block mb-1 font-serif text-base text-emerald-800 dark:text-emerald-400">Mission Statement:</strong> 
          To ensure zero historical attrition of traditional Okun dialectical folklore and municipal records while accelerating cross-community infrastructural awareness.
        </div>
      </div>
    </div>
  );
}
