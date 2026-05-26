import type { Metadata } from 'next';
import { requireRole } from '@/libs/auth/guards';
import { MainTemplate } from '@/templates/MainTemplate';

export const metadata: Metadata = {
  title: 'My Dashboard — Okunpedia',
  description: 'Manage your contributor profile and access the admin portal.',
};

export default async function DashboardLayout(props: { children: React.ReactNode }) {
  await requireRole('USER', '/sign-in');
  return <MainTemplate>{props.children}</MainTemplate>;
}
