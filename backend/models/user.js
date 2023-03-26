import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }],
});

const User2 = mongoose.model("User2", userSchema);
export default User2;
