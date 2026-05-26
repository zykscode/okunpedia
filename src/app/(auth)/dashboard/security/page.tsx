import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/libs/DB';
import { loginActivityTable } from '@/models/Schema';
import { SecuritySettingsForm } from './SecuritySettingsForm';

export default async function SecuritySettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // Fetch recent login history logs
  const activityLogs = await db
    .select()
    .from(loginActivityTable)
    .where(eq(loginActivityTable.userId, session.user.id))
    .orderBy(desc(loginActivityTable.createdAt))
    .limit(8);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Account Security Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your credentials and review active sessions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Form and Connection Column */}
        <div className="space-y-8 md:col-span-2">
          <div className="border-gray-150 rounded-2xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Update Password
            </h2>
            <SecuritySettingsForm />
          </div>
        </div>

        {/* Login Activity Sidebar */}
        <div className="border-gray-150 rounded-2xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Recent Logins</h2>
          <div className="space-y-4">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-gray-500">No login history recorded.</p>
            ) : (
              activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="border-b border-gray-100 pb-3 last:border-none last:pb-0 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {log.ipAddress || 'Unknown IP'}
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {log.status}
                    </span>
                  </div>
                  <p
                    className="mt-1 truncate text-[10px] text-gray-400"
                    title={log.userAgent || ''}
                  >
                    {log.userAgent || 'Unknown Device'}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
