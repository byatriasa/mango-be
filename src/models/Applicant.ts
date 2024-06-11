import mongoose, { Schema } from 'mongoose'

// define schema
const schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    identity_number: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    dob: {
      type: Date
    }
  },
  { timestamps: true }
)

export type ApplicantSchema = mongoose.InferSchemaType<typeof schema>

// define model
const Applicant =
  (mongoose.models.Applicant as mongoose.Model<ApplicantSchema>) ??
  mongoose.model('Applicant', schema)

export default Applicant
