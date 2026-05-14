import { UserProfile } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile - Contributor Dashboard',
  description: 'Manage authentication tokens, connected accounts, and profile settings.',
};

export default function UserProfilePage() {
  return (
    <div className="my-6 lg:-ml-12">
      <UserProfile path="/dashboard/user-profile" />
    </div>
  );
}
