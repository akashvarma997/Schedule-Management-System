import express from "express";
import mongoose from "mongoose";
import  dotenv  from 'dotenv';
import bodyParser from "body-parser";
import cors from "cors";
import {
  addMeeting,
  deleteMeeting,
  getAllMeetings,
  getMeeting,
  updateMeeting,
} from "./controllers/meetings.js";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
} from "./controllers/users.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// endpoint for creating a new meeting
app.post("/meeting", addMeeting);

// endpoint for getting all meetings
app.get("/meeting", getAllMeetings);

// endpoint for getting a meeting by ID
app.get("/meeting/:id", getMeeting);

// endpoint for updating a meeting by ID
app.put("/meeting/:id", updateMeeting);

// endpoint for deleting a meeting by ID
app.delete("/meeting/:id", deleteMeeting);

// endpoint for creating a new user
app.post("/user", addUser);

// endpoint for getting all users
app.get("/user", getAllUsers);

// endpoint for getting a user by ID
app.get("/user/:id", getUser);

// endpoint for deleting a user by ID
app.delete("/user/:id", deleteUser);


//Connection Settings:
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", true);
mongoose
  .connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
