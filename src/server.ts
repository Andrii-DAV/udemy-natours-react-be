import app from './app';
import { connectDB } from './db';

app.listen(process.env.PORT, () => {
  console.log(`App running on http://localhost:${process.env.PORT}/`);
});

connectDB();
