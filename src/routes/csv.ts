import { Router, NextFunction } from 'express'
import { UploadedFile } from 'express-fileupload'
import { ValidationError } from 'joi'
import httpErrors from 'http-errors'

import { Response, Request } from '../custom'
import { Csv as CsvC } from '../services'
import { DtoCsv } from '../dto-interfaces'
import { csvSchema } from '../schemas'
import { response } from '../utils'

const Csv = Router()

const getFileObject = (input: UploadedFile | UploadedFile[]): UploadedFile => {
  if (Array.isArray(input)) return input[0]

  return input
}

Csv.route('/csv').post(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.files) {
      const { files } = req
      const file = Object.keys(files)[0]
      const fileObj = getFileObject(files[file])

      try {
        const fileToUpload: DtoCsv = {
          data    : fileObj.data,
          encoding: fileObj.encoding,
          mimetype: fileObj.mimetype,
          name    : fileObj.name,
          size    : fileObj.size
        }
        const csv = new CsvC(fileToUpload)
        const result = await csv.process({ type: 'upload' })

        await csvSchema.validateAsync(fileToUpload)
        response(false, result, res, 201)
      } catch (e) {
        if (e instanceof ValidationError)
          return next(new httpErrors.UnprocessableEntity(e.message))

        next(e)
      }
    } else next(new httpErrors.BadRequest('Missing file'))
  }
)

export { Csv }
