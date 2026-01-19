-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'email',
    "provider_id" TEXT,
    "avatar_url" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "genre" TEXT,
    "pov" TEXT,
    "mode" TEXT,
    "word_count" INTEGER NOT NULL DEFAULT 0,
    "character_count" INTEGER NOT NULL DEFAULT 0,
    "creativity_level" INTEGER NOT NULL DEFAULT 7,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkpoints" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "label" TEXT,
    "word_count" INTEGER NOT NULL DEFAULT 0,
    "character_count" INTEGER NOT NULL DEFAULT 0,
    "checkpoint_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_generations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "story_id" TEXT,
    "generation_type" TEXT NOT NULL,
    "prompt" TEXT,
    "generated_content" TEXT,
    "model_used" TEXT,
    "tokens_used" INTEGER,
    "generation_time_ms" INTEGER,
    "creativity_level" INTEGER,
    "temperature" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_stats" (
    "user_id" TEXT NOT NULL,
    "total_stories" INTEGER NOT NULL DEFAULT 0,
    "total_words" INTEGER NOT NULL DEFAULT 0,
    "total_characters" INTEGER NOT NULL DEFAULT 0,
    "total_generations" INTEGER NOT NULL DEFAULT 0,
    "genre_fantasy" INTEGER NOT NULL DEFAULT 0,
    "genre_scifi" INTEGER NOT NULL DEFAULT 0,
    "genre_mystery" INTEGER NOT NULL DEFAULT 0,
    "genre_romance" INTEGER NOT NULL DEFAULT 0,
    "genre_thriller" INTEGER NOT NULL DEFAULT 0,
    "genre_horror" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "stories_user_id_idx" ON "stories"("user_id");

-- CreateIndex
CREATE INDEX "stories_genre_idx" ON "stories"("genre");

-- CreateIndex
CREATE INDEX "stories_created_at_idx" ON "stories"("created_at");

-- CreateIndex
CREATE INDEX "checkpoints_story_id_idx" ON "checkpoints"("story_id");

-- CreateIndex
CREATE INDEX "ai_generations_user_id_idx" ON "ai_generations"("user_id");

-- CreateIndex
CREATE INDEX "ai_generations_story_id_idx" ON "ai_generations"("story_id");

-- CreateIndex
CREATE INDEX "ai_generations_generation_type_idx" ON "ai_generations"("generation_type");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkpoints" ADD CONSTRAINT "checkpoints_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
