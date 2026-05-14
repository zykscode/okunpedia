import { db } from '@/libs/DB';
import { communitiesSchema } from '@/models/Schema';

export default function AdminCommunitiesNewPage() {
  // Simple inline Server Action for MVP data insertion
  async function createCommunityAction(formData: FormData) {
    'use server';

    const nameEntry = formData.get('name');
    const name = typeof nameEntry === 'string' ? nameEntry : '';

    const slugEntry = formData.get('slug');
    const slug = typeof slugEntry === 'string' ? slugEntry : '';

    const lgaEntry = formData.get('lga');
    const lga = typeof lgaEntry === 'string' ? lgaEntry : '';

    const clanEntry = formData.get('districtOrClan');
    const districtOrClan = typeof clanEntry === 'string' ? clanEntry : '';

    const historyEntry = formData.get('historicalBackground');
    const historicalBackground = typeof historyEntry === 'string' ? historyEntry : '';

    if (!name || !slug || !lga) {
      throw new Error('Missing required parameters');
    }

    await db.insert(communitiesSchema).values({
      name,
      slug,
      lga,
      districtOrClan: districtOrClan ?? 'General',
      historicalBackground,
      createdBy: 'admin_user',
    });
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit New Community Entry</h1>
        <p className="text-sm text-gray-600">
          Enter the essential geographic and historical background parameters for the town.
        </p>
      </div>

      <form
        action={createCommunityAction}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Town Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Community Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g. Kabba, Mopa, Isanlu"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-blue-500 focus:ring-blue-500"
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
              placeholder="e.g. kabba, mopa, isanlu"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* LGA */}
          <div>
            <label htmlFor="lga" className="block text-sm font-medium text-gray-700">
              Local Government Area
            </label>
            <select
              id="lga"
              name="lga"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Kabba/Bunu">Kabba/Bunu</option>
              <option value="Mopa-Muro">Mopa-Muro</option>
              <option value="Ijumu">Ijumu</option>
              <option value="Yagba East">Yagba East</option>
              <option value="Yagba West">Yagba West</option>
            </select>
          </div>

          {/* District or Clan */}
          <div>
            <label htmlFor="districtOrClan" className="block text-sm font-medium text-gray-700">
              Traditional District or Clan
            </label>
            <input
              type="text"
              id="districtOrClan"
              name="districtOrClan"
              placeholder="e.g. Gbede, Bunu, Mopa clan"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Historical Background */}
        <div className="mt-6">
          <label htmlFor="historicalBackground" className="block text-sm font-medium text-gray-700">
            Historical Background & Founding Lore
          </label>
          <textarea
            id="historicalBackground"
            name="historicalBackground"
            rows={6}
            placeholder="Document migration background, founding ancestral figures, and prominent traditional lineages..."
            className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 text-sm shadow-xs focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-hidden cursor-pointer"
          >
            Save Community Record
          </button>
        </div>
      </form>
    </div>
  );
}
