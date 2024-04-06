import app from './app';
import { connectDB } from './db';
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception!', err);
  process.exit(1);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on http://localhost:${process.env.PORT}/`);
});

connectDB();

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection!', err);

  server.close(() => {
    process.exit(1);
  });
});
