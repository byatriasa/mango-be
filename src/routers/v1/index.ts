import { Router } from 'express'

// Import routes
import applicantRoute from './applicant.route'

const router = Router({ mergeParams: true })

router.use('/applicant', applicantRoute)

export default router
