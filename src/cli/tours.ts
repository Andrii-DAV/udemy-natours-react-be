import * as fs from 'fs';
import Tour from '../models/tourModel';
import * as process from 'process';
import * as dotenv from 'dotenv';
import { connectDB } from '../db';

// tsc cli/tours.ts after updates
// node cli/tours.js using --import OR --delete flag

dotenv.config({ path: './.env' });

connectDB();

export const addToTableFromJson = async () => {
  const tours = fs.readFileSync(
    `${__dirname}/../assets/data/tours-simple.json`,
    'utf-8',
  );
  try {
    await Tour.create(JSON.parse(tours));
    console.log(
      'assets/data/tours-simple.json docs were successfully added to collection!',
    );
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
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
