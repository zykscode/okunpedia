import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { MainTemplate } from '@/templates/MainTemplate';

export const metadata: Metadata = {
  title: 'My Dashboard — Okunpedia',
  description: 'Manage your contributor profile, review security settings, and access the admin portal.',
};

export default async function DashboardLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  return <MainTemplate>{props.children}</MainTemplate>;
}
