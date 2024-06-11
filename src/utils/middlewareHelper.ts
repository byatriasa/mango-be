import type { NextFunction, Request, Response } from 'express'

// ---------------------------------------------

export type AsyncMiddleware<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

/**
 * Wraps an async middleware with a try/catch block to catch any errors
 * and pass them to the error handling middleware.
 */
export function createMiddleware<T extends Request = Request>(
  middleware: AsyncMiddleware<T>
): Middleware {
  return (req, res, next) => {
    Promise.resolve(middleware(req as T, res, next)).catch(next)
  }
}
