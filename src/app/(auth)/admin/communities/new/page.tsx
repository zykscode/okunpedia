import { NewCommunityForm } from './NewCommunityForm';

export default function AdminCommunitiesNewPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit New Community Entry</h1>
        <p className="text-sm text-gray-600">
          Enter the essential geographic and historical background parameters for the town.
        </p>
      </div>

      <NewCommunityForm />
    </div>
  );
}
