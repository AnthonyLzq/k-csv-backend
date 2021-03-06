import { IncomingHttpHeaders } from 'http'
import { Request } from 'express'

/*
 * With this piece of code we ca personalize the attributes of the request,
 * in case we need it.
 */

interface CustomRequest extends Request {
  headers      : IncomingHttpHeaders & {
    'api-key'?: string
  }
}

export { CustomRequest as Request }
