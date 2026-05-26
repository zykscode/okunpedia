import { SignOutButton } from '@/components/SignOutButton';
import type { Metadata } from 'next';
import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Contributor Desk - Okunpedia Admin',
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

  return (
    <BaseTemplate
      leftNav={
        <>
          <li>
            <Link
              href="/admin/"
              className="border-none font-bold text-gray-900 hover:text-blue-700"
            >
              Contributor Desk
            </Link>
          </li>
          <li>
            <Link
              href="/admin/communities/new/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              + Submit Community Entry
            </Link>
          </li>
          <li>
            <Link href="/" className="border-none text-gray-500 hover:text-gray-900">
              &larr; View live atlas
            </Link>
          </li>
        </>
      }
      rightNav={
        <>
          <li>
            <SignOutButton />
          </li>
        </>
      }
    >
      <div className="py-5">{props.children}</div>
    </BaseTemplate>
  );
}

