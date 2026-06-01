"use server";

import { db } from "@/libs/DB";
import { jobVacanciesSchema, jobApplicationsSchema } from "@/models/Schema";
import { eq } from "drizzle-orm";

export async function createJobVacancy(data: {
  title: string;
  description: string;
  location: string;
  type: string;
  authorId: string;
}) {
  const [vacancy] = await db
    .insert(jobVacanciesSchema)
    .values({
      title: data.title,
      description: data.description,
      location: data.location,
      type: data.type,
      authorId: data.authorId,
    })
    .returning();

  return vacancy;
}

export async function submitJobApplication(data: {
  vacancyId: number;
  applicantName: string;
  applicantEmail: string;
  resumeUrl: string;
  coverLetter?: string;
}) {
  const [application] = await db
    .insert(jobApplicationsSchema)
    .values({
      vacancyId: data.vacancyId,
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      resumeUrl: data.resumeUrl,
      coverLetter: data.coverLetter,
    })
    .returning();

  return application;
}

export async function getJobVacancies() {
  return await db.select().from(jobVacanciesSchema).orderBy(jobVacanciesSchema.createdAt);
}

export async function getJobVacancy(id: number) {
  const [vacancy] = await db.select().from(jobVacanciesSchema).where(eq(jobVacanciesSchema.id, id));
  return vacancy;
}
