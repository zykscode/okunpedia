import { auth } from '@/auth';
import { Sponsors } from './Sponsors';

export const Hello = async () => {
  const session = await auth();
  const nameOrEmail = session?.user?.name || session?.user?.email || 'Contributor';

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs">
        <h2 className="font-serif text-xl font-bold text-gray-900">
          👋 Welcome back, {nameOrEmail}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          You are currently authenticated within the secure workspace. Use the portal navigation to submit newly sourced traditional entries, review submitted demographic metrics, or edit local community lineage articles.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="font-serif text-lg font-bold text-gray-900">
          Active Ecosystem Collaborators
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Technical infrastructure sustained by verified foundation patrons.
        </p>
        <div className="mt-4">
          <Sponsors />
        </div>
      </div>
    </>
  );
};
