import { SignOutButton } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';

export const metadata: Metadata = {
  title: 'Contributor Dashboard - Okunpedia Admin',
  description: 'Manage community records, update traditional lineage details, and track validation metrics.',
};

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <BaseTemplate
      leftNav={
        <>
          <li>
            <Link href="/dashboard/" className="border-none text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/user-profile/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              User Profile
            </Link>
          </li>
        </>
      }
      rightNav={
        <>
          <li>
            <SignOutButton><button className="border-none text-gray-700 hover:text-gray-900 cursor-pointer" type="button">Sign Out</button></SignOutButton>
          </li>
        </>
      }
    >
      {props.children}
    </BaseTemplate>
  );
}
