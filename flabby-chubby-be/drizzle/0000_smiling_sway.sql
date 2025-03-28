CREATE TABLE "flabby"."league_members" (
	"league_member_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "flabby"."leagues" (
	"league_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "flabby"."scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "flabby"."users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"device_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"device_type" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "flabby"."league_members" ADD CONSTRAINT "league_members_league_id_leagues_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "flabby"."leagues"("league_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flabby"."league_members" ADD CONSTRAINT "league_members_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "flabby"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flabby"."leagues" ADD CONSTRAINT "leagues_owner_id_users_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "flabby"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flabby"."scores" ADD CONSTRAINT "scores_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "flabby"."users"("user_id") ON DELETE no action ON UPDATE no action;