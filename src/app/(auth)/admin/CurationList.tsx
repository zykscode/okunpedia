'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  approveTownAction,
  rejectTownAction,
  approveRevisionAction,
  rejectRevisionAction,
} from './actions';

type PendingTown = {
  id: string;
  name: string;
  tagline: string | null;
  overview: string;
  lgaName: string | null;
  createdAt: Date;
};

type PendingRevision = {
  id: number;
  townId: string;
  townName: string | null;
  originalName: string | null;
  originalTagline: string | null;
  originalOverview: string | null;
  originalHistoricalBackground: string | null;
  originalFoundingStories: string | null;
  originalCultureAndTraditions: string | null;
  name: string;
  tagline: string | null;
  overview: string;
  historicalBackground: string | null;
  foundingStories: string | null;
  cultureAndTraditions: string | null;
  submittedBy: string | null;
  createdAt: Date;
};

type Props = {
  pendingTowns: PendingTown[];
  pendingRevisions: PendingRevision[];
};

export function CurationList(props: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'uploads' | 'revisions'>('uploads');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApproveTown = (id: string) => {
    setMessage(null);
    startTransition(async () => {
      const res = await approveTownAction(id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  const handleRejectTown = (id: string) => {
    if (!confirm('Are you sure you want to reject and permanently delete this town upload submission?')) {
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const res = await rejectTownAction(id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  const handleApproveRevision = (id: number) => {
    setMessage(null);
    startTransition(async () => {
      const res = await approveRevisionAction(id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  const handleRejectRevision = (id: number) => {
    if (!confirm('Are you sure you want to reject this town edit revision?')) {
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const res = await rejectRevisionAction(id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl border text-sm transition-all duration-300 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50'
              : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'uploads'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Town Uploads ({props.pendingTowns.length})
        </button>
        <button
          onClick={() => setActiveTab('revisions')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'revisions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Town Revisions ({props.pendingRevisions.length})
        </button>
      </div>

      {isPending && (
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}

      {/* Content */}
      {!isPending && activeTab === 'uploads' && (
        <div className="space-y-4">
          {props.pendingTowns.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-6 text-center text-sm">
              No pending town uploads to verify.
            </p>
          ) : (
            props.pendingTowns.map((town) => (
              <div
                key={town.id}
                className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {town.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      LGA: <span className="font-semibold text-gray-700 dark:text-gray-300">{town.lgaName || 'N/A'}</span>
                    </p>
                    {town.tagline && (
                      <p className="text-sm italic text-gray-600 dark:text-gray-300 mt-2">
                        &ldquo;{town.tagline}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveTown(town.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer border-none"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleRejectTown(town.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer border-none"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Historical Overview & Background
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {town.overview}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isPending && activeTab === 'revisions' && (
        <div className="space-y-6">
          {props.pendingRevisions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-6 text-center text-sm">
              No pending town revisions to verify.
            </p>
          ) : (
            props.pendingRevisions.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4 flex-wrap mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Revision for {rev.townName || 'Unknown Town'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Submitted by: <span className="font-semibold text-gray-700 dark:text-gray-300">{rev.submittedBy || 'Anonymous'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveRevision(rev.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer border-none"
                    >
                      Approve Revision
                    </button>
                    <button
                      onClick={() => handleRejectRevision(rev.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer border-none"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Diff Side-by-side or Before/After blocks */}
                <div className="space-y-4">
                  {/* Name Check */}
                  {rev.name !== rev.originalName && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
                      <div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Current Name</span>
                        <p className="text-sm text-gray-550 line-through">{rev.originalName || '(None)'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider block mb-1">Proposed Name</span>
                        <p className="text-sm text-gray-900 dark:text-white font-bold">{rev.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Tagline Check */}
                  {rev.tagline !== rev.originalTagline && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
                      <div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Current Tagline</span>
                        <p className="text-sm text-gray-550 line-through">{rev.originalTagline || '(None)'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider block mb-1">Proposed Tagline</span>
                        <p className="text-sm text-gray-900 dark:text-white font-bold">{rev.tagline || '(Cleared)'}</p>
                      </div>
                    </div>
                  )}

                  {/* Historical Background Check */}
                  {rev.historicalBackground !== rev.originalHistoricalBackground && (
                    <div className="space-y-2 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
                      <div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Current Historical Background</span>
                        <p className="text-xs text-gray-550 line-through whitespace-pre-wrap">{rev.originalHistoricalBackground || '(None)'}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-800">
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider block mb-1">Proposed Historical Background</span>
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{rev.historicalBackground || '(Cleared)'}</p>
                      </div>
                    </div>
                  )}

                  {/* Founding Stories Check */}
                  {rev.foundingStories !== rev.originalFoundingStories && (
                    <div className="space-y-2 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
                      <div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Current Founding Stories</span>
                        <p className="text-xs text-gray-550 line-through whitespace-pre-wrap">{rev.originalFoundingStories || '(None)'}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-800">
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider block mb-1">Proposed Founding Stories</span>
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{rev.foundingStories || '(Cleared)'}</p>
                      </div>
                    </div>
                  )}

                  {/* Culture & Traditions Check */}
                  {rev.cultureAndTraditions !== rev.originalCultureAndTraditions && (
                    <div className="space-y-2 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
                      <div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Current Culture & Traditions</span>
                        <p className="text-xs text-gray-550 line-through whitespace-pre-wrap">{rev.originalCultureAndTraditions || '(None)'}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-800">
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider block mb-1">Proposed Culture & Traditions</span>
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{rev.cultureAndTraditions || '(Cleared)'}</p>
                      </div>
                    </div>
                  )}

                  {/* Overview Check */}
                  {rev.overview !== rev.originalOverview && (
                    <div className="space-y-2 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-100 dark:border-gray-900">
                      <div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Current Overview</span>
                        <p className="text-xs text-gray-550 line-through whitespace-pre-wrap">{rev.originalOverview || '(None)'}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-800">
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider block mb-1">Proposed Overview</span>
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{rev.overview}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
