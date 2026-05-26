import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { MainTemplate } from '@/templates/MainTemplate';

export const metadata: Metadata = {
  title: 'Admin Portal — Okunpedia',
  description: 'Submit and verify comprehensive local community monographs and publication posts.',
};

export default async function AdminLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  const role = session.user?.role;
  const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';

  if (!isAdmin) {
    redirect('/dashboard');
  }

  return <MainTemplate>{props.children}</MainTemplate>;
}
