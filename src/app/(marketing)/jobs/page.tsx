import { getJobVacancies } from "@/features/jobs/actions";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Job Vacancies | Okunpedia",
  description: "Explore and apply for job vacancies in Okun communities.",
};

export default async function JobsPage() {
  const vacancies = await getJobVacancies();

  return (
    <main className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Job Vacancies</h1>
        <Link href="/jobs/new" className="focus:outline-hidden">
          <Button variant="primary">Post a Vacancy</Button>
        </Link>
      </div>

      {vacancies.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground text-lg">
            No job vacancies available right now. Check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy.id}
              className="p-6 border rounded-xl hover:shadow-md transition-shadow bg-card"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    <Link href={`/jobs/${vacancy.id}`} className="hover:underline">
                      {vacancy.title}
                    </Link>
                  </h2>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span>{vacancy.location ?? "Remote"}</span>
                    <span>•</span>
                    <span>{vacancy.type}</span>
                    <span>•</span>
                    <span className="capitalize">{vacancy.status}</span>
                  </div>
                </div>
                <Link href={`/jobs/${vacancy.id}`} className="focus:outline-hidden">
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
