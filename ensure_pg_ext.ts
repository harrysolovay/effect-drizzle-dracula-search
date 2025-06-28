import { PgClient } from "@effect/sql-pg"
import { Console, Effect } from "effect"
import { PgClientLive } from "./layers.ts"

await Effect.gen(function*() {
  yield* Console.log("Register PG extensions.")
  const sql = yield* PgClient.PgClient
  yield* sql`
    CREATE EXTENSION if NOT EXISTS "uuid-ossp";
    CREATE EXTENSION if NOT EXISTS vector;
  `
}).pipe(
  Effect.provide(PgClientLive),
  Effect.runPromise,
)
