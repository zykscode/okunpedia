import { SignOutButton } from "@/components/SignOutButton";
import type { Metadata } from "next";
import { Link } from "@/libs/I18nNavigation";
import { BaseTemplate } from "@/templates/BaseTemplate";

export const metadata: Metadata = {
  title: "Contributor Dashboard - Okunpedia Admin",
  description:
    "Manage community records, update traditional lineage details, and track validation metrics.",
};

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout(props: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <BaseTemplate
      leftNav={
        <>
          <li>
            <Link
              href="/dashboard/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/security/"
              className="border-none text-gray-700 hover:text-gray-900 ml-4"
            >
              Security
            </Link>
          </li>
        </>
      }
      rightNav={
        <>
          <li>
            <SignOutButton />
          </li>
        </>
      }
    >
      {props.children}
    </BaseTemplate>
  );
}
