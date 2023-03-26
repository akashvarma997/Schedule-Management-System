import User from "../models/user.js";
import Meeting from "../models/meeting.js";

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).send("User with this email already exists");
    } else {
      const user = new User({
        name,
        email,
        password,
      });

      await user.save();

      res.status(201).json(user);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("meetings");
    res.json(user);
  } catch (error) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // find all the meetings where the user is the only participant
    const meetings = await Meeting.find({ participants: user._id }).populate(
      "user"
    );
    const organisedMeetings = await Meeting.find({ user: user._id })
      .populate("user")
      .populate("participants");
    for (const meeting of meetings) {
      if (meeting.participants.length === 1) {
        // delete the meeting if the user is the only participant
        await meeting.user.meetings.pull(meeting._id);
        await meeting.user.save();
        await Meeting.deleteOne({ _id: meeting._id });
      } else {
        // remove the user from the participants list if there are other participants
        await meeting.participants.pull(user._id);
        await meeting.save();
      }
    }

    for (const meeting of organisedMeetings) {
      for (const participant of meeting.participants) {
        participant.meetings.pull(meeting._id);
        await participant.save();
      }
      await Meeting.deleteOne({ _id: meeting._id });
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};
