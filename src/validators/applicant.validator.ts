import z from 'zod'

export type RegBody = z.infer<typeof regBody>
export const regBody = z.object({
  name: z.string().min(1),
  identity_number: z.string().length(16).regex(/^\d+$/),
  email: z.string().email(),
  dob: z.string().date()
})
