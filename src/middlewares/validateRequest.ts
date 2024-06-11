import type { Request, NextFunction, Response } from 'express'
import type { AnyZodObject } from 'zod'
import z, { ZodError } from 'zod'

// utils
import { createMiddleware } from '~/utils/middlewareHelper'

// ---------------------------------------------

type ValidateRequestParams = {
  query?: AnyZodObject | AnyZodObject[]
  body?: AnyZodObject | AnyZodObject[]
}

type ValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

/**
 * Middleware to validate request body and query.
 * By default, it will strip out any unknown properties from the request body and query.
 * You can apply multiple schemas to the body and query, by passing an array of schemas
 * and it will merge them into one schema using `ZodObject.merge()` method
 * @example
 * ```ts
 * const UserAuthSchema = z.object({...})
 * const UserProfileSchema = z.object({...})
 *
 * router.post(
 *  'users/:id',
 *  validateRequest({body: [UserAuthSchema, UserProfileSchema]}),
 *  ... // other middlewares
 * )
 * ```
 **/
export default function validateRequest(
  params?: ValidateRequestParams
): ValidatorMiddleware {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  return createMiddleware(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // validate request body
        const appliedBodySchema =
          params?.body != null
            ? Array.isArray(params?.body)
              ? params?.body.reduce(
                  (acc, schema) => acc.merge(schema),
                  z.object({})
                )
              : params?.body
            : z.object({})

        const validatedBody = appliedBodySchema.parse(req.body)

        req.body = validatedBody

        // validate request query
        const appliedQuerySchema =
          params?.query != null
            ? Array.isArray(params.query)
              ? params.query.reduce(
                  (acc, schema) => acc.merge(schema),
                  z.object({})
                )
              : params.query
            : z.object({})

        const validatedQuery = appliedQuerySchema.parse(req.query)

        req.query = validatedQuery

        next()
      } catch (err) {
        // handle validation error
        if (err instanceof ZodError) {
          res.status(400).json({
            code: 'validation-error',
            message:
              'There is an error in the input you provided, please double check and try again.',
            results: err.flatten().fieldErrors
          })

          return
        }

        next(err)
      }
    }
  )
}
