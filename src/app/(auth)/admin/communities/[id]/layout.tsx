import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { townTable } from '@/models/Schema';
import { requireRole } from '@/libs/auth/guards';

const TABS = [
  { href: '', label: 'Overview' },
  { href: '/edit', label: 'Edit Info' },
  { href: '/sections', label: 'Sections' },
  { href: '/people', label: 'People' },
  { href: '/rulers', label: 'Rulers' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/media', label: 'Media' },
  { href: '/map', label: 'Map' },
];

export default async function CommunityAdminLayout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  await requireRole('ADMIN');
  const { id } = await props.params;

  const [town] = await db
    .select({ id: townTable.id, name: townTable.name, published: townTable.published })
    .from(townTable)
    .where(eq(townTable.id, id))
    .limit(1);

  if (!town) notFound();

  const base = `/admin/communities/${id}`;

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
          <Link href="/admin" className="hover:text-emerald-600">Admin</Link>
          <span>/</span>
          <Link href="/admin/communities" className="hover:text-emerald-600">Communities</Link>
          <span>/</span>
          <span className="truncate max-w-[180px]">{town.name}</span>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="font-serif text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {town.name}
          </h1>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            town.published
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
          }`}>
            {town.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Tab nav */}
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200/80 bg-gray-50/80 p-1 dark:border-gray-800 dark:bg-gray-900/50">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={`${base}${tab.href}`}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-white hover:text-gray-900 hover:shadow-xs dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Page content */}
      {props.children}
    </div>
  );
}
