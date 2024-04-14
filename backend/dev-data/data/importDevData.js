const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewsModel");

dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log(`DB connected`))
  .catch((err) => console.error(`DB connection failed: ${err}`));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"),
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

// import the data
async function importData() {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });
    await Tour.create(tours, { validateBeforeSave: false });

    console.log(`Data Successfully loaded.📜`);
  } catch (error) {
    console.error(`⚠️⚠️  importing data failed: ${error}  ⚠️⚠️`);
  } finally {
    process.exit();
  }
}

async function deleteData() {
  try {
    await Review.deleteMany();
    await User.deleteMany();
    await Tour.deleteMany();

    console.log(`Data successfully Deleted.🗑️`);
  } catch (error) {
    console.error(`⚠️⚠️   deleting data failed: ${error}  ⚠️⚠️`);
  } finally {
    process.exit();
  }
}

if (process.argv[2] === "--import") importData();
if (process.argv[2] === "--delete") deleteData();
