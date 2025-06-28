import { Data, Effect } from "effect"

export class ChunkSizeLtOverlap extends Data.TaggedError("ChunkSizeLtOverlap") {}

export const chunkText = Effect.fn(function*(
  text: string,
  chunkSize: number,
  overlap: number,
) {
  if (chunkSize <= overlap) {
    return yield* Effect.fail(new ChunkSizeLtOverlap())
  }
  const step = chunkSize - overlap
  const result: string[] = []
  for (let start = 0; start < text.length; start += step) {
    const end = Math.min(start + chunkSize, text.length)
    result.push(text.slice(start, end))
    if (end === text.length) break
  }
  return result
})
