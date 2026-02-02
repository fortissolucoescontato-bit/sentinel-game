CREATE TABLE "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"attacker_id" integer NOT NULL,
	"defender_id" integer NOT NULL,
	"safe_id" integer,
	"input_prompt" text NOT NULL,
	"ai_response" text NOT NULL,
	"success" boolean DEFAULT false NOT NULL,
	"credits_spent" integer DEFAULT 10 NOT NULL,
	"style_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"secret_word" varchar(255) NOT NULL,
	"system_prompt" text NOT NULL,
	"defense_level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unlocked_safes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"safe_id" integer NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255),
	"email" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"credits" integer DEFAULT 1000 NOT NULL,
	"style_points" integer DEFAULT 0 NOT NULL,
	"tier" varchar(50) DEFAULT 'free' NOT NULL,
	"unlocked_themes" text[] DEFAULT ARRAY['dracula']::text[] NOT NULL,
	"current_theme" varchar(50) DEFAULT 'dracula' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_attacker_id_users_id_fk" FOREIGN KEY ("attacker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_defender_id_users_id_fk" FOREIGN KEY ("defender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs" ADD CONSTRAINT "logs_safe_id_safes_id_fk" FOREIGN KEY ("safe_id") REFERENCES "public"."safes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "safes" ADD CONSTRAINT "safes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unlocked_safes" ADD CONSTRAINT "unlocked_safes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unlocked_safes" ADD CONSTRAINT "unlocked_safes_safe_id_safes_id_fk" FOREIGN KEY ("safe_id") REFERENCES "public"."safes"("id") ON DELETE cascade ON UPDATE no action;