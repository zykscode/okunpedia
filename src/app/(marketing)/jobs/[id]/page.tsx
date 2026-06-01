import { getJobVacancy } from "@/features/jobs/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import ApplicationForm from "./ApplicationForm";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const vacancy = await getJobVacancy(Number.parseInt(resolvedParams.id, 10));

  if (!vacancy) {
    return notFound();
  }

  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl">
      <Link href="/jobs" className="text-primary hover:underline mb-6 inline-block">
        &larr; Back to jobs
      </Link>

      <div className="bg-card border rounded-xl p-8 mb-8 shadow-sm">
        <div className="flex justify-between items-start mb-6 border-b pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{vacancy.title}</h1>
            <div className="flex gap-4 text-muted-foreground">
              <span>{vacancy.location ?? "Remote"}</span>
              <span>•</span>
              <span>{vacancy.type}</span>
              <span>•</span>
              <span>Posted on {new Date(vacancy.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
            {vacancy.status}
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h3 className="text-xl font-semibold mb-4">Job Description</h3>
          <p className="whitespace-pre-wrap">{vacancy.description}</p>
        </div>
      </div>

      {vacancy.status === "open" && (
        <div className="bg-muted/30 border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Apply for this Position</h2>
          <ApplicationForm vacancyId={vacancy.id} />
        </div>
      )}
    </main>
  );
}
