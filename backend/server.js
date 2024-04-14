const mongoose = require("mongoose");
const dotenv = require("dotenv");

/**
 * global synchronous code bug handler
 * TODO: we need to add a functionality so that the server can restart after shutting down.
 * this function should be place before synchronous code executions otherwise it can not catch errors
 */
process.on("uncaughtException", (err) => {
  const purple = "\x1b[35m";
  console.log(`${purple} ⚠️ UNHANDLED EXCEPTION💥... SHUTTING DOWN ⚠️`);
  console.log(`${purple} ERROR:`, err.name, err.message);

  // un clean state exit immediately
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .catch((err) => console.log(`DB connection failed💥: ${err}`))
  .then(() => console.log(`connected`));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  const blue = "\x1b[34m";

  console.log(
    `${blue} App running ${process.env.NODE_ENV.toUpperCase()} on localhost:${port}...`,
  );
});

/**
 * Any promise that we don't handle will be catched here
 * TODO: we need to add a functionality so that the server can restart after shutting down.
 * it should be before all of code executions
 * */
process.on("unhandledRejection", (err) => {
  const purple = "\x1b[35m";
  console.log(`${purple} ⚠️ UNHANDLED REJECTION💥... SHUTTING DOWN ⚠️ `);
  console.log(`${purple} ERROR:`, err.name, err.message);

  server.close(() => process.exit(1));
});

// herocu 24 restart thing
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED💤");

  // no need for  process.exit(1) sigterm will do it automatically
  server.close(() => console.log(`Process terminated💥`));
});
