import mongoose from 'mongoose'
import type { ZodBoolean, ZodEffects } from 'zod'
import z from 'zod'

export const zMongoObjectId = (
  errorMessage?: string
): z.ZodType<mongoose.Types.ObjectId> => {
  return z
    .custom<mongoose.Types.ObjectId>(
      (val: any) => mongoose.Types.ObjectId.isValid(val),
      { message: errorMessage ?? 'Must be a valid id' }
    )
    .transform((val) => new mongoose.Types.ObjectId(val))
}

export const zBooleanish = (): ZodEffects<ZodBoolean, boolean, unknown> =>
  z.preprocess((val) => {
    if (typeof val === 'string') {
      if (val === 'true') return true
      if (val === 'false') return false
    }

    if (typeof val === 'number') {
      if (val === 1) return true
      if (val === 0) return false
    }

    return val
  }, z.boolean())
