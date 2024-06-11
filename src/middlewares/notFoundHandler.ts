import type { Request, Response } from 'express'

/**
 * Middleware to handle not found request
 **/
export default function notFoundHandler(_: Request, res: Response): void {
  res.status(404).send({
    code: 'not-found',
    message: 'URL not found.'
  })
}
