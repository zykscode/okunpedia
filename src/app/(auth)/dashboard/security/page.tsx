import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/libs/DB";
import { loginActivityTable, userTable } from "@/models/Schema";
import { eq, desc } from "drizzle-orm";
import SecuritySettingsForm from "./SecuritySettingsForm";

export default async function SecuritySettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Enforce email verification redirect
  if (!session.user.isEmailVerified && !session.user.isOAuth) {
    redirect("/verify-email");
  }

  // Fetch user information to check password config
  const [user] = await db
    .select({ password: userTable.password, email: userTable.email })
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1);

  const hasPassword = !!user?.password;

  // Fetch recent login history logs
  const activityLogs = await db
    .select()
    .from(loginActivityTable)
    .where(eq(loginActivityTable.userId, session.user.id))
    .orderBy(desc(loginActivityTable.createdAt))
    .limit(8);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Account Security Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your credentials, linked accounts, and review active sessions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form and Connection Column */}
        <div className="md:col-span-2 space-y-8">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Update Password
            </h2>
            {hasPassword ? (
              <SecuritySettingsForm />
            ) : (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-sm rounded-xl">
                Your account is currently using Google Sign-In. You do not have
                a password configured.
              </div>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Linked Accounts
            </h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
              <div className="flex items-center gap-3">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.1.14 1.14 2.53l3.3 2.56c1.93-1.78 3.03-4.4 3.03-7.53z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.83-2.97c-1.08.73-2.48 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01L1.29 17.15C3.27 21.09 7.32 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.24 14.27a8.27 8.27 0 0 1 0-4.54l-3.87-3C.5 8.35 0 10.12 0 12s.5 3.65 1.37 5.27l3.87-3z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.27 2.91 1.29 6.85l3.87 3c.95-2.88 3.61-5.1 6.84-5.1z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Google Connection
                  </p>
                  <p className="text-xs text-gray-500">
                    Sign in instantly with Google OAuth
                  </p>
                </div>
              </div>
              <div>
                {session.user.isOAuth ? (
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full border border-green-150 dark:border-green-900/50">
                    Connected
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Not Connected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Login Activity Sidebar */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recent Logins
          </h2>
          <div className="space-y-4">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-gray-500">
                No login history recorded.
              </p>
            ) : (
              activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="pb-3 border-b border-gray-100 dark:border-gray-800 last:border-none last:pb-0"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {log.ipAddress || "Unknown IP"}
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {log.status}
                    </span>
                  </div>
                  <p
                    className="text-[10px] text-gray-400 mt-1 truncate"
                    title={log.userAgent || ""}
                  >
                    {log.userAgent || "Unknown Device"}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
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
