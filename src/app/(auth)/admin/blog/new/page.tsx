import { db } from '@/libs/DB';
import { blogPostsSchema } from '@/models/Schema';

export default function AdminBlogNewPage() {
  // Inline Server Action for blog article insertion
  async function publishBlogAction(formData: FormData) {
    'use server';

    const titleEntry = formData.get('title');
    const title = typeof titleEntry === 'string' ? titleEntry : '';

    const slugEntry = formData.get('slug');
    const slug = typeof slugEntry === 'string' ? slugEntry : '';

    const excerptEntry = formData.get('excerpt');
    const excerpt = typeof excerptEntry === 'string' ? excerptEntry : '';

    const contentEntry = formData.get('content');
    const content = typeof contentEntry === 'string' ? contentEntry : '';

    const catEntry = formData.get('category');
    const category = typeof catEntry === 'string' ? catEntry : '';

    if (!title || !slug || !content) {
      throw new Error('Missing required article contents');
    }

    await db.insert(blogPostsSchema).values({
      title,
      slug,
      excerpt: excerpt ?? '',
      content,
      category: category ?? 'history',
      authorId: 'admin_user', // Target pre-authenticated user identity mapping
      status: 'published',
      publishedAt: new Date(),
    });
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Draft Publication Article</h1>
        <p className="text-sm text-gray-600">
          Compose archival documentation, regional socio-economic analyses, or community featured press announcements.
        </p>
      </div>

      <form
        action={publishBlogAction}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Article Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Article Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g. Preserving the Olubunu Cultural Artifacts"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* URL Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              URL Slug Identifier
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              placeholder="e.g. preserving-olubunu-artifacts"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category & Excerpt */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Curation Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="history">History</option>
              <option value="culture">Culture</option>
              <option value="news">Local News</option>
              <option value="development">Development</option>
              <option value="editorial">Editorial</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Article Excerpt Summary
            </label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              placeholder="Brief snapshot summary for the blog directory preview cards..."
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content Body (Markdown Supported)
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            placeholder="Write markdown documentation supporting historical cross-references and media uploads..."
            className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 font-mono text-sm shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 focus:outline-hidden cursor-pointer"
          >
            Publish Article
          </button>
        </div>
      </form>
    </div>
  );
}
