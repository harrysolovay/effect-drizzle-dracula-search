import { AiEmbeddingModel } from "@effect/ai"
import { Terminal } from "@effect/platform"
import { BunTerminal } from "@effect/platform-bun"
import * as PgDrizzle from "@effect/sql-drizzle/Pg"
import { cosineDistance } from "drizzle-orm"
import { Console, Effect, Layer } from "effect"
import { Live } from "./layers.ts"
import { bookChunks } from "./schema/messages.ts"

await Effect.gen(function*() {
  const term = yield* Terminal.Terminal
  yield* Console.log("Input some search terms:\n")
  const line = yield* term.readLine
  const em = yield* AiEmbeddingModel.AiEmbeddingModel
  const embedding = yield* em.embed(line)
  const db = yield* PgDrizzle.PgDrizzle
  const similarity = cosineDistance(bookChunks.embedding, embedding)
  const similarChunks = yield* db
    .select({
      similarity,
      id: bookChunks.id,
      body: bookChunks.body,
    })
    .from(bookChunks)
    .orderBy((t) => t.similarity)
    .limit(5)
  for (const { body } of similarChunks) {
    yield* Console.log(body + "\n\n---\n\n")
  }
}).pipe(
  Effect.provide(Live),
  Effect.provide(BunTerminal.layer),
  Effect.runPromise,
)
