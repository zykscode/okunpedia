'use client';

import { useState, useTransition, useRef } from 'react';
import {
  addHierarchyAction,
  deleteHierarchyAction,
  addRelationshipAction,
  deleteRelationshipAction,
} from '../actions';

type Community = {
  id: number;
  name: string;
};

type ParentRelation = {
  id: number;
  parentId: number;
  parentName: string | null;
  context: string;
  notes: string | null;
};

type ChildRelation = {
  id: number;
  childId: number;
  childName: string | null;
  context: string;
  notes: string | null;
};

type ResolvedRelationship = {
  id: number;
  relatedId: number;
  relatedName: string;
  relationshipType: string;
  description: string | null;
  establishedPeriod: string | null;
};

export function RelationshipManager(props: {
  townId: string;
  currentId: number;
  allCommunities: Community[];
  initialParents: ParentRelation[];
  initialChildren: ChildRelation[];
  initialRelationships: ResolvedRelationship[];
}) {
  const [parents, setParents] = useState<ParentRelation[]>(props.initialParents);
  const [children, setChildren] = useState<ChildRelation[]>(props.initialChildren);
  const [relationships, setRelationships] = useState<ResolvedRelationship[]>(props.initialRelationships);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hierarchyFormRef = useRef<HTMLFormElement>(null);
  const relationshipFormRef = useRef<HTMLFormElement>(null);

  const selectableCommunities = props.allCommunities.filter((c) => c.id !== props.currentId);

  const handleAddHierarchy = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await addHierarchyAction(props.townId, { success: false, message: '' }, formData);
      if (res.success) {
        setSuccess(res.message);
        hierarchyFormRef.current?.reset();
        window.location.reload();
      } else {
        setError(res.message);
      }
    });
  };

  const handleDeleteHierarchy = async (id: number) => {
    if (!confirm('Are you sure you want to remove this hierarchical connection?')) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deleteHierarchyAction(props.townId, id);
      if (res.success) {
        setSuccess(res.message);
        setParents((prev) => prev.filter((item) => item.id !== id));
        setChildren((prev) => prev.filter((item) => item.id !== id));
      } else {
        setError(res.message);
      }
    });
  };

  const handleAddRelationship = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await addRelationshipAction(props.townId, { success: false, message: '' }, formData);
      if (res.success) {
        setSuccess(res.message);
        relationshipFormRef.current?.reset();
        window.location.reload();
      } else {
        setError(res.message);
      }
    });
  };

  const handleDeleteRelationship = async (id: number) => {
    if (!confirm('Are you sure you want to remove this community relationship connection?')) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deleteRelationshipAction(props.townId, id);
      if (res.success) {
        setSuccess(res.message);
        setRelationships((prev) => prev.filter((item) => item.id !== id));
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="space-y-12">
      {/* Global Status messages */}
      {(error || success) && (
        <div className="rounded-xl border p-4 text-sm transition-all duration-300">
          {error && <p className="font-semibold text-red-600 dark:text-red-400">{error}</p>}
          {success && <p className="font-semibold text-emerald-600 dark:text-emerald-400">{success}</p>}
        </div>
      )}

      {/* SECTION 1: HIERARCHICAL CONNECTIONS */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-800">
            Hierarchical Structures (Parent / Child Communities)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Establish if this community belongs under a parent town, or if it is a major town containing other quarters, villages, and satellite settlements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Add Hierarchy Connection Form */}
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Add Hierarchical Relation</h4>
              
              <form ref={hierarchyFormRef} action={handleAddHierarchy} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Relation Type</label>
                  <select
                    name="relationType"
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="child">Has Sub-Community / Quarter (Child)</option>
                    <option value="parent">Is Subordinate to (Parent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Target Community</label>
                  <select
                    name="targetCommunityId"
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="">Select a community...</option>
                    {selectableCommunities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Context</label>
                  <select
                    name="context"
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="administrative">Administrative (e.g. ward, district subdivisions)</option>
                    <option value="historical">Historical (settlement origins and expansion)</option>
                    <option value="social">Social / Clan Alliance</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    placeholder="e.g. Quarter founded in the late 19th century by migrants from the main town."
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Adding...' : 'Add Hierarchical Link'}
                </button>
              </form>
            </div>
          </div>

          {/* Current Hierarchy Links List */}
          <div className="md:col-span-2 space-y-6">
            {/* Parents Section */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Parent Communities / Clans</h4>
              {parents.length === 0 ? (
                <p className="mt-2 text-sm text-gray-400">No parent community configured.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs font-bold text-gray-400 uppercase dark:border-gray-800">
                        <th className="py-2.5">Parent Community</th>
                        <th className="py-2.5">Context</th>
                        <th className="py-2.5">Notes</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                      {parents.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                          <td className="py-3 font-semibold text-gray-900 dark:text-white">
                            {item.parentName || 'Unknown'}
                          </td>
                          <td className="py-3 capitalize">{item.context}</td>
                          <td className="py-3 max-w-[200px] truncate" title={item.notes || ''}>
                            {item.notes || '—'}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteHierarchy(item.id)}
                              disabled={isPending}
                              className="rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Children Section */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Subordinate Communities / Quarters / Villages</h4>
              {children.length === 0 ? (
                <p className="mt-2 text-sm text-gray-400">No sub-communities configured under this community.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs font-bold text-gray-400 uppercase dark:border-gray-800">
                        <th className="py-2.5">Sub-Community</th>
                        <th className="py-2.5">Context</th>
                        <th className="py-2.5">Notes</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                      {children.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                          <td className="py-3 font-semibold text-gray-900 dark:text-white">
                            {item.childName || 'Unknown'}
                          </td>
                          <td className="py-3 capitalize">{item.context}</td>
                          <td className="py-3 max-w-[200px] truncate" title={item.notes || ''}>
                            {item.notes || '—'}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteHierarchy(item.id)}
                              disabled={isPending}
                              className="rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: RELATIONSHIPS */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-800">
            Horizontal Alliances & Historical Connections
          </h3>
          <p className="text-xs text-gray-550 mt-1">
            Establish bilateral relationships like sister-town connections, migration source/destinations, cultural alliances, or shared monarchies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Add Relationship Form */}
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Add Relationship Link</h4>
              
              <form ref={relationshipFormRef} action={handleAddRelationship} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Related Community</label>
                  <select
                    name="targetCommunityId"
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="">Select a community...</option>
                    {selectableCommunities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Relationship Type</label>
                  <select
                    name="relationshipType"
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="sister_town">Sister Town Connection</option>
                    <option value="migrated_from">Origin / Migrated From</option>
                    <option value="cultural_alliance">Cultural Alliance</option>
                    <option value="shared_monarchy">Shared Monarchy</option>
                    <option value="shared_festival">Shared Festival</option>
                    <option value="dialect_cluster">Dialect Cluster</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Established Period (Optional)</label>
                  <input
                    type="text"
                    name="establishedPeriod"
                    placeholder="e.g. Pre-colonial, 18th Century"
                    className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Description (Optional)</label>
                  <textarea
                    name="description"
                    placeholder="e.g. The two towns share historical bonds and hold joint festivals."
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-gray-200/80 bg-white px-3 py-2 text-sm outline-hidden focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Adding...' : 'Add Relationship'}
                </button>
              </form>
            </div>
          </div>

          {/* Current Relationships List */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Active Relationships ({relationships.length})</h4>
              {relationships.length === 0 ? (
                <p className="mt-2 text-sm text-gray-400">No active relations documented yet.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs font-bold text-gray-400 uppercase dark:border-gray-800">
                        <th className="py-2.5">Connected Community</th>
                        <th className="py-2.5">Relationship Type</th>
                        <th className="py-2.5">Established Period</th>
                        <th className="py-2.5">Description</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                      {relationships.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                          <td className="py-3 font-semibold text-gray-900 dark:text-white">
                            {item.relatedName}
                          </td>
                          <td className="py-3">
                            <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 text-xs font-bold border border-blue-100 dark:border-blue-900/40">
                              {item.relationshipType.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3">{item.establishedPeriod || '—'}</td>
                          <td className="py-3 max-w-[200px] truncate" title={item.description || ''}>
                            {item.description || '—'}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteRelationship(item.id)}
                              disabled={isPending}
                              className="rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
