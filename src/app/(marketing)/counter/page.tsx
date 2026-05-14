import type { Metadata } from 'next';
import Image from 'next/image';
import { CounterForm } from '@/components/CounterForm';
import { CurrentCount } from '@/components/CurrentCount';
import { Badge } from '@/components/ui/Badge';
import arcjetLogo from '@/public/assets/images/arcjet-light.svg';

export const metadata: Metadata = {
  title: 'Shared State Counter - Okunpedia Verification Suite',
  description: 'Interactive real-time demonstration counter validating edge persistent state logic.',
};

export default function Counter() {
  return (
    <div className="mx-auto max-w-lg space-y-8 py-8">
      <div className="border-b border-gray-200 pb-6 dark:border-gray-800">
        <Badge variant="amber">State Engine</Badge>
        <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Shared Persistent Counter
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          State synchronization testbed protected against anomalous bots.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/60">
        <CounterForm />

        <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
          <CurrentCount />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs sm:text-sm dark:border-gray-800">
        <span className="text-gray-500 dark:text-gray-400">Security powered by{' '}</span>
        <a
          className="text-blue-700 font-bold hover:underline dark:text-blue-400"
          href="https://launch.arcjet.com/Q6eLbRE"
        >
          Arcjet
        </a>
      </div>

      <a href="https://launch.arcjet.com/Q6eLbRE" className="block inline-block mx-auto focus:outline-hidden">
        <Image className="mx-auto mt-2" src={arcjetLogo} alt="Arcjet" width={130} />
      </a>
    </div>
  );
}
