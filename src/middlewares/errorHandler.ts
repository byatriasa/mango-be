import type { NextFunction, Request, Response } from 'express'

// utils
import { ServiceException } from '~/utils/customError'
// ---------------------------------------------

/**
 * Middleware to handle error,
 * also automatically handle `ControllerException` error and send it as response
 **/
export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ServiceException) {
    err.sendAsResponse(res)

    return
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[UNHANDLED ERROR]', err)
  } else {
    console.log('[UNHANDLED ERROR]', err.message)
  }

  res.status(500).send({
    code: 'server-error',
    message:
      'An error occurred while processing your request, please try again in a moment.'
  })
}
