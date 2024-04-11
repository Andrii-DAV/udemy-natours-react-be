import * as fs from 'fs';
import Tour from '../models/tourModel';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { connectDB } from '../db';
import Review from '../models/reviewModel';
import User from '../models/userModel';

// ts-node src/cli/init.ts using --import OR --delete flag
// ts-node src/cli/init.ts --import
// ts-node src/cli/init.ts --delete

dotenv.config({ path: './.env' });

connectDB();

export const addToTableFromJson = async () => {
  const tours = fs.readFileSync(
    `${__dirname}/../assets/data/tours.json`,
    'utf-8',
  );
  const users = fs.readFileSync(
    `${__dirname}/../assets/data/users.json`,
    'utf-8',
  );
  const reviews = fs.readFileSync(
    `${__dirname}/../assets/data/reviews.json`,
    'utf-8',
  );

  try {
    await Tour.create(JSON.parse(tours));
    await Review.create(JSON.parse(reviews));
    await User.create(JSON.parse(users), { validateBeforeSave: false });

    console.log(
      'assets/data/tours.json docs were successfully added to collection!',
    );
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  addToTableFromJson();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
