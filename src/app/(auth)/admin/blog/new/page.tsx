'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { publishBlogAction, type ActionState } from '../../actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 focus:outline-hidden disabled:opacity-50 cursor-pointer"
    >
      {pending ? 'Publishing...' : 'Publish Article'}
    </button>
  );
}

export default function AdminBlogNewPage() {
  const [state, formAction] = useActionState<ActionState, FormData>(publishBlogAction, {
    success: false,
    message: '',
  });

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Draft Publication Article</h1>
        <p className="text-sm text-gray-600">
          Compose archival documentation, regional socio-economic analyses, or community featured press announcements.
        </p>
      </div>

      <form
        action={formAction}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs"
      >
        {state.message && (
          <div className={`mb-6 rounded-md p-4 text-sm ${state.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {state.message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Article Title */}
          <div className="md:col-span-2">
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
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
