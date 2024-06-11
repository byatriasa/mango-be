import type { NextFunction, Request, Response } from 'express'

// ---------------------------------------------

/**
 * Middleware to log request
 */
export default function logRequest(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${req.method}] ${req.originalUrl}`)
  }

  next()
}
