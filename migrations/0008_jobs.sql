CREATE TABLE IF NOT EXISTS "job_vacancies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" text,
	"type" text DEFAULT 'Full-time' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"author_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"vacancy_id" integer NOT NULL,
	"applicant_name" text NOT NULL,
	"applicant_email" text NOT NULL,
	"resume_url" text NOT NULL,
	"cover_letter" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_vacancies_status_idx" ON "job_vacancies" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_applications_vacancy_idx" ON "job_applications" USING btree ("vacancy_id");
--> statement-breakpoint
ALTER TABLE "job_vacancies" ADD CONSTRAINT "job_vacancies_author_id_user_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_vacancy_id_job_vacancies_id_fk" FOREIGN KEY ("vacancy_id") REFERENCES "public"."job_vacancies"("id") ON DELETE cascade ON UPDATE no action;
