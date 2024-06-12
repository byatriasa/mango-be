// environment variables
import 'dotenv/config'

import applicantService from './applicant'

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import db from '~/instances/db'
import { ServiceException } from '~/utils/customError'

describe('Create Applicant', () => {
  beforeAll(async () => {
    await db.connect()
  })

  afterAll(async () => {
    await db.conn.close()
  })

  it('should create applicant', async () => {
    const mock = {
      name: 'John Doe',
      identity_number: '1111222233334445',
      email: 'john@email.com',
      dob: '1990-01-01'
    }

    const result = await applicantService.createApplicant(mock)

    expect(result).toEqual(
      expect.objectContaining({
        ...mock,
        dob: new Date(mock.dob)
      })
    )

    await db.conn.collection('applicants').deleteOne({ _id: result._id })
  })

  it('should throw error if identity number or email already exist', async () => {
    const mock = {
      name: 'John Doe',
      identity_number: '1111222233334445',
      email: 'john@email.com',
      dob: '1990-01-01'
    }

    const data = await applicantService.createApplicant(mock)

    try {
      await applicantService.createApplicant(mock)
    } catch (error) {
      console.log(error)
      expect(error).toBeInstanceOf(ServiceException)
    }

    await db.conn.collection('applicants').deleteOne({ _id: data._id })
  })
})
