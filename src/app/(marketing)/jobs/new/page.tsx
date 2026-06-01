import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewJobForm from "./NewJobForm";

export const metadata = {
  title: "Post a New Job Vacancy | Okunpedia",
};

export default async function NewJobPage() {
  const session = await auth();

  // Require user to be logged in to post a vacancy
  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/jobs/new");
  }

  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Post a New Job Vacancy</h1>
        <p className="text-muted-foreground">
          Fill out the details below to create a new job posting on Okunpedia.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-8 shadow-sm">
        <NewJobForm userId={session.user.id} />
      </div>
    </main>
  );
}
