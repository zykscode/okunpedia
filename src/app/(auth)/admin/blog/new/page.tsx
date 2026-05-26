import { NewBlogForm } from './NewBlogForm';

export default function AdminBlogNewPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Draft Publication Article</h1>
        <p className="text-sm text-gray-600">
          Compose archival documentation, regional socio-economic analyses, or community featured press announcements.
        </p>
      </div>

      <NewBlogForm />
    </div>
  );
}
