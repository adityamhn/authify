import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";


export interface OnboardingDoc {
  completed: boolean;
  step: number;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  password: string;
  email: string;
  onboarding: OnboardingDoc;
  createdAt: Date;
  useType: string;
  MatchPassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,20})+$/,
  },
  password: {
    type: String,
  },
  onboarding: {
    completed: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3],
    },
  },
  useType: {
    type: String,
    enum: ["personal", "professional"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.MatchPassword = async function (password: string) {
  const user = this as UserDoc;
  return bcrypt.compareSync(password, user.password);
};

export default mongoose.model<UserDoc>("User", UserSchema);
