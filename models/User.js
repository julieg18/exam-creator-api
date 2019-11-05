import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      validate: {
        validator: (username) => User.doesNotExist({ username }),
        message: 'Username already exists',
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (email) => User.doesNotExist({ email }),
        message: 'Email already exists',
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

UserSchema.statics.doesNotExist = async function(field) {
  return (await this.where(field).countDocuments()) === 0;
};

const User = mongoose.model('User', UserSchema);

export default User;
