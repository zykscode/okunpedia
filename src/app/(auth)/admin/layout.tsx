import type { Metadata } from 'next';
import { requireRole } from '@/libs/auth/guards';
import { MainTemplate } from '@/templates/MainTemplate';

export const metadata: Metadata = {
  title: 'Admin Portal — Okunpedia',
  description: 'Submit and verify comprehensive local community monographs and publication posts.',
};

export default async function AdminLayout(props: { children: React.ReactNode }) {
  await requireRole('ADMIN', '/dashboard');
  return <MainTemplate>{props.children}</MainTemplate>;
}

