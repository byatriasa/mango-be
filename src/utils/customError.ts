import type { Response } from 'express'
import invariant from 'tiny-invariant'

// ---------------------------------------------------------------------------------------------

const SERVICE_EXCEPTION_ERROR_TYPE = [
  'server',
  'user',
  'not-found',
  'permission'
]

// ---------------------------------------------------------------------------------------------
// NEW SERVICE EXCEPTION, WITH AUTOMATIC ERROR HANDLING IN MIDDLEWARE

/**
 * Get HTTP status code based on error type
 */
function getErrorTypeStatusCode(
  type: (typeof SERVICE_EXCEPTION_ERROR_TYPE)[number]
): number {
  if (type === 'server') return 500
  if (type === 'user') return 400
  if (type === 'permission') return 40
  if (type === 'not-found') return 404

  // default fallback to 500 error
  return 500
}

// ---------------------------------------------------------------------------------------------

type ServiceExceptionParams = {
  type: (typeof SERVICE_EXCEPTION_ERROR_TYPE)[number]
  code: string
  message: string
  cause?: Error
}

/**
 * Error class to be thrown for error within service
 * allowing the error to be automatically handled by `errorHander` middleware
 * @extends Error
 */
export class ServiceException extends Error {
  type = 'server'
  code = 'general-error'

  constructor(params: ServiceExceptionParams) {
    super()
    const { type, code, message, cause } = params

    invariant(
      SERVICE_EXCEPTION_ERROR_TYPE.includes(type),
      'Invalid ServiceException error type'
    )
    invariant(code, 'ServiceException error code is required!')
    invariant(message, 'ServiceException error message is required!')

    this.name = 'ServiceException'
    this.message = message
    this.cause = cause

    this.type = type
    this.code = code
  }

  sendAsResponse = (res: Response): void => {
    res.status(getErrorTypeStatusCode(this.type)).send({
      code: this.code,
      message: this.message
    })
  }
}
