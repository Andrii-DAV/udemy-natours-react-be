import mongoose, { Types } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export type UserRole = 'user' | 'guide' | 'lead-guide' | 'admin';
export type MongooseId = Types.ObjectId;
export interface IUser {
  name: string;
  _id: MongooseId;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  role: UserRole;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active: boolean;

  //methods
  createPasswordResetToken: () => string;
  // eslint-disable-next-line no-unused-vars
  correctPassword: (candidatePassword: string, userPassword: string) => boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password Confirm is required.'],
    validate: {
      // only works on CREATE OR SAVE
      validator: function (val: string) {
        return val === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only run if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});
userSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  // this.password won't work because of the select: false.
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
