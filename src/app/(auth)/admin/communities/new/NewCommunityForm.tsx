'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCommunityAction } from '../../actions';
import type { ActionState } from '../../actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-hidden disabled:opacity-50"
    >
      {pending ? 'Saving...' : 'Save Community Record'}
    </button>
  );
}

export function NewCommunityForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createCommunityAction, {
    success: false,
    message: '',
  });

  return (
    <form
      action={formAction}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs"
    >
      {state.message && (
        <div
          className={`mb-6 rounded-md p-4 text-sm ${state.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Town Name */}
        <div className="md:col-span-2">
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
        <SubmitButton />
      </div>
    </form>
  );
}
