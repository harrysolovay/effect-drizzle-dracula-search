CREATE TABLE "book_chunks" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"body" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
