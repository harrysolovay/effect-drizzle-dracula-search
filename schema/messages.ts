import { sql } from "drizzle-orm"
import { pgTable, text, uuid, vector } from "drizzle-orm/pg-core"

export const bookChunks = pgTable("book_chunks", {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  body: text().notNull(),
  embedding: vector({ dimensions: 1536 }).notNull(),
})
