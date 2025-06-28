import { OpenAiClient, OpenAiEmbeddingModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import * as PgDrizzle from "@effect/sql-drizzle/Pg"
import { PgClient } from "@effect/sql-pg"
import { Config, Layer } from "effect"

export const PgClientLive = PgClient.layerConfig({
  url: Config.redacted("DATABASE_URL"),
})

export const PgDrizzleLive = PgDrizzle.layer.pipe(
  Layer.provide(PgClientLive),
)

export const OpenAiEmbeddingModelLive = OpenAiEmbeddingModel
  .model("text-embedding-ada-002", { mode: "batched" })
  .pipe(
    Layer.provideMerge(
      OpenAiClient.layerConfig({
        apiKey: Config.redacted("OPENAI_API_KEY"),
      }),
    ),
  )

export const Live = Layer.empty.pipe(
  Layer.provideMerge(PgDrizzleLive),
  Layer.provideMerge(OpenAiEmbeddingModelLive),
  Layer.provideMerge(FetchHttpClient.layer),
)
