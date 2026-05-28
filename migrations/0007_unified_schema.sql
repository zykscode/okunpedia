CREATE TABLE IF NOT EXISTS "community_hierarchy" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer NOT NULL,
	"child_id" integer NOT NULL,
	"context" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_community_id" integer NOT NULL,
	"target_community_id" integer NOT NULL,
	"relationship_type" text NOT NULL,
	"description" text,
	"established_period" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_aliases" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"alias" text NOT NULL,
	"type" text DEFAULT 'dialectal' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_timeline" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_type" text NOT NULL,
	"period_start" text,
	"period_end" text,
	"references" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_revisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"name" text NOT NULL,
	"tagline" text,
	"overview" text,
	"district_or_clan" text,
	"historical_background" text,
	"founding_stories" text,
	"culture_and_traditions" text,
	"festivals_and_rituals" text,
	"economic_activities" text,
	"submitted_by_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "tagline" text;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "overview" text;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "meta_description" text;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "lga_id" text;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "created_by_id" text;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "parent_community_id" integer;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "settlement_type" text DEFAULT 'standalone_town' NOT NULL;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "classification" text;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "population" integer;
--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN IF NOT EXISTS "founded" text;
--> statement-breakpoint
ALTER TABLE "prominent_indigenes" ADD COLUMN IF NOT EXISTS "title" text;
--> statement-breakpoint
ALTER TABLE "prominent_indigenes" ADD COLUMN IF NOT EXISTS "role" text;
--> statement-breakpoint
ALTER TABLE "prominent_indigenes" ADD COLUMN IF NOT EXISTS "birth_year" integer;
--> statement-breakpoint
ALTER TABLE "prominent_indigenes" ADD COLUMN IF NOT EXISTS "death_year" integer;
--> statement-breakpoint
ALTER TABLE "prominent_indigenes" ADD COLUMN IF NOT EXISTS "is_alive" boolean;
--> statement-breakpoint
ALTER TABLE "community_versions" ADD COLUMN IF NOT EXISTS "community_id_temp" integer;
--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "community_id_temp" integer;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hierarchy_parent_idx" ON "community_hierarchy" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hierarchy_child_idx" ON "community_hierarchy" USING btree ("child_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "relationship_source_idx" ON "community_relationships" USING btree ("source_community_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "relationship_target_idx" ON "community_relationships" USING btree ("target_community_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "alias_community_idx" ON "community_aliases" USING btree ("community_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "timeline_community_idx" ON "community_timeline" USING btree ("community_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "timeline_event_type_idx" ON "community_timeline" USING btree ("event_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "community_revisions_community_idx" ON "community_revisions" USING btree ("community_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "community_revisions_status_idx" ON "community_revisions" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "communities_lgaId_idx" ON "communities" USING btree ("lga_id");
--> statement-breakpoint
ALTER TABLE "community_hierarchy" ADD CONSTRAINT "community_hierarchy_parent_id_communities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "community_hierarchy" ADD CONSTRAINT "community_hierarchy_child_id_communities_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "community_relationships" ADD CONSTRAINT "community_relationships_source_community_id_communities_id_fk" FOREIGN KEY ("source_community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "community_relationships" ADD CONSTRAINT "community_relationships_target_community_id_communities_id_fk" FOREIGN KEY ("target_community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "community_aliases" ADD CONSTRAINT "community_aliases_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "community_timeline" ADD CONSTRAINT "community_timeline_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "community_revisions" ADD CONSTRAINT "community_revisions_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "community_revisions" ADD CONSTRAINT "community_revisions_submitted_by_id_User_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_lga_id_LGA_id_fk" FOREIGN KEY ("lga_id") REFERENCES "public"."LGA"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_created_by_id_User_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_parent_community_id_communities_id_fk" FOREIGN KEY ("parent_community_id") REFERENCES "public"."communities"("id") ON DELETE set null ON UPDATE no action;