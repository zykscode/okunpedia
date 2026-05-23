CREATE TABLE "LGA" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"stateId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ProminentPerson" (
	"id" text PRIMARY KEY NOT NULL,
	"townId" text NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"role" text,
	"biography" text,
	"birthYear" integer,
	"deathYear" integer,
	"isAlive" boolean,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "town_revisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"townId" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text,
	"overview" text NOT NULL,
	"rulerTitle" text,
	"traditionalRuler" text,
	"submittedById" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Town" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"tagline" text,
	"overview" text NOT NULL,
	"metaDescription" text,
	"lat" double precision,
	"lng" double precision,
	"population" integer,
	"founded" text,
	"published" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"lgaId" text NOT NULL,
	"tribeId" text,
	"createdById" text NOT NULL,
	"rulerTitle" text,
	"traditionalRuler" text,
	"randomFacts" text[],
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"name" text,
	"image" text,
	"password" text,
	"role" text,
	"status" text,
	"bio" text,
	"location" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
