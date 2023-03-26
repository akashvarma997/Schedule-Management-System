import mongoose from "mongoose";
const meetingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  room: { type: String, enum: ["r1", "r2", "r3", "r4", "r5"], required: true },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User2",
    required: true,
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User2",
    required: true,
  },
});

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
