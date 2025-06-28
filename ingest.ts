import { AiEmbeddingModel } from "@effect/ai"
import { FileSystem } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import * as PgDrizzle from "@effect/sql-drizzle/Pg"
import { Console, Effect, Layer } from "effect"
import { chunkText } from "./chunkText.ts"
import { Live } from "./layers.ts"
import { bookChunks } from "./schema/messages.ts"

const vectorize = Effect.fn(function*(body: string) {
  const em = yield* AiEmbeddingModel.AiEmbeddingModel
  const embedding = yield* em.embed(body)
  const db = yield* PgDrizzle.PgDrizzle
  yield* db.insert(bookChunks).values({ body, embedding })
})

await Effect.gen(function*() {
  const fs = yield* FileSystem.FileSystem
  const text = yield* fs.readFileString("dracula.txt")
  const chunks = yield* chunkText(text, 5000, 200)
  for (let i = 0; i < chunks.length; i++) {
    yield* Console.log(`Vectorizing chunk ${i}/${chunks.length}`)
    yield* vectorize(chunks[i]!)
  }
}).pipe(
  Effect.provide(Live),
  Effect.provide(BunFileSystem.layer),
  Effect.runPromise,
)
