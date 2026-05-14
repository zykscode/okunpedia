import { SignOutButton } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';

export const metadata: Metadata = {
  title: 'Contributor Hub Admin - Okunpedia Heritage',
  description: 'Submit and verify comprehensive local community monographs and publication posts.',
};

export default function AdminLayout(props: { children: React.ReactNode }) {
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
            <Link href="/admin/blog/new/" className="border-none text-gray-700 hover:text-gray-900">
              + Draft Publication
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
            <SignOutButton><button className="border-none text-gray-700 hover:text-gray-900 cursor-pointer" type="button">Sign out</button></SignOutButton>
          </li>
        </>
      }
    >
      <div className="py-5">{props.children}</div>
    </BaseTemplate>
  );
}
