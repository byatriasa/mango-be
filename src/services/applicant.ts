// models
import type { HydratedDocument } from 'mongoose'
import type { ApplicantSchema } from '~/models/Applicant'
import Applicant from '~/models/Applicant'

// utils
import { ServiceException } from '~/utils/customError'

// params
type CreateApplicantParams = {
  name: string
  identity_number: string
  email: string
  dob: string
}

async function createApplicant(
  data: CreateApplicantParams
): Promise<HydratedDocument<ApplicantSchema>> {
  const applicant = await Applicant.findOne({
    identity_number: data.identity_number,
    email: data.email
  })

  if (applicant) {
    throw new ServiceException({
      type: 'user',
      code: 'applicant-exists',
      message: 'Applicant already exists'
    })
  }

  const result = await Applicant.create(data)

  return result
}

const applicantService = {
  createApplicant
}

export default applicantService
