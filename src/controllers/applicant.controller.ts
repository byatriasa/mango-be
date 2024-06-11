// service
import applicantService from '~/services/applicant'

// utils
import { createMiddleware } from '~/utils/middlewareHelper'

// validators
import type { applicantValidator } from '~/validators'

// POST /auth
const post = createMiddleware(async (req, res) => {
  const body = req.body as applicantValidator.RegBody

  const results = await applicantService.createApplicant(body)

  res.send({ message: 'Login successful!', results })
})

const applicantController = {
  post
}

export default applicantController
