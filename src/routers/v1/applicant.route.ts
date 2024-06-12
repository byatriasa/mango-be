import { Router } from 'express'

// middlewares
import validateRequest from '~/middlewares/validateRequest'

// controllers
import applicantController from '~/controllers/applicant.controller'

// validators
import { applicantValidator } from '~/validators'

// ---------------------------------------------

const router = Router({ mergeParams: true })

// POST /applicant
router.post(
  '/',
  validateRequest({
    body: applicantValidator.regBody
  }),
  applicantController.post
)

export default router
