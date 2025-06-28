import { defineConfig } from "drizzle-kit"
import { Config, Effect, Redacted } from "effect"

const url = Config.redacted("DATABASE_URL").pipe(Effect.runSync)

export default defineConfig({
  schema: "schema/**/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Redacted.value(url),
  },
  out: "migrations",
})
