import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    mongoose.Promise = Promise;
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
