const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION 🔴 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: './config.env'
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log(`
    ====================================
    DB connection successful 🚀
    ====================================
    Environment: ${process.env.NODE_ENV}
    ====================================
    `);
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 🔒 Shutting down...');
  console.log(err.name, err.message);
  // server.close first complete all the pending request and then the process.exit in the callback instantly closes the server. 1 in process.exit() means uncaught exception and 0 means success
  server.close(() => {
    process.exit(1);
  });
});
