CREATE TYPE "public"."amenity_category" AS ENUM('education', 'healthcare', 'road', 'water', 'power', 'market', 'security');--> statement-breakpoint
CREATE TYPE "public"."amenity_status" AS ENUM('functional', 'dilapidated', 'under_construction', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."audit_target_type" AS ENUM('community', 'revision', 'user', 'media', 'indigene', 'ruler', 'amenity');--> statement-breakpoint
CREATE TYPE "public"."community_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'audio', 'document');--> statement-breakpoint
CREATE TYPE "public"."revision_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR', 'USER');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'SUSPENDED', 'BANNED');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"target_type" "audit_target_type" NOT NULL,
	"target_id" text NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"snapshot" jsonb NOT NULL,
	"changed_by_id" text,
	"change_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text,
	"uploaded_by_id" text,
	"type" "media_type" DEFAULT 'image' NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"caption" text,
	"alt_text" text,
	"mime_type" text,
	"size_bytes" integer,
	"width" integer,
	"height" integer,
	"is_hero" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_User_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_versions" ADD CONSTRAINT "community_versions_changed_by_id_User_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_User_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_actor_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_target_idx" ON "audit_logs" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "audit_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "community_versions_community_idx" ON "community_versions" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "community_versions_changed_by_idx" ON "community_versions" USING btree ("changed_by_id");--> statement-breakpoint
CREATE INDEX "media_community_idx" ON "media" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "media_type_idx" ON "media" USING btree ("type");--> statement-breakpoint
CREATE INDEX "media_hero_idx" ON "media" USING btree ("is_hero");--> statement-breakpoint
CREATE INDEX "login_user_idx" ON "login_activity" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "login_status_idx" ON "login_activity" USING btree ("status");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "User" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_status_idx" ON "User" USING btree ("status");