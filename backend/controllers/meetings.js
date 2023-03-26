import User from "../models/user.js";
import Meeting from "../models/meeting.js";

export const addMeeting = async (req, res) => {
  try {
    let { date, start_time, end_time, room, participants, user } = req.body;
    start_time = `${date}T${start_time}:00Z`;
    end_time = `${date}T${end_time}:00Z`;
    const updatedParticipants = [];
    participants.forEach((p) => updatedParticipants.push(p.toString()));
    // Check if the room is available at the requested date and time
    const conflict = await Meeting.find({
      $and: [
        {
          $or: [
            { room: room, date: date },
            { participants: { $in: participants }, date: date },
            { participants: user, date: date },
            { user: { $in: participants }, date: date },
            { user: user, date: date },
          ],
        },
        {
          $and: [
            {
              start_time: { $lte: start_time },
              end_time: { $gte: start_time },
            },
            {
              start_time: { $lte: end_time },
              end_time: { $gte: end_time },
            },
            {
              start_time: { $gte: start_time },
              end_time: { $lte: end_time },
            },
          ],
        },
      ],
    }).select("participants room date start_time end_time user");

    if (conflict.length > 0) {
      const conflictingParticipants = [];
      let userConflict = null;
      for (const c of conflict) {
        c.participants.forEach((p) => {
          if (updatedParticipants.includes(p.toString())) {
            conflictingParticipants.push(p);
          }
        });
        if (c.user == user) {
          userConflict = true;
        }
        if (updatedParticipants.includes(c.user.toString())) {
          conflictingParticipants.push(c.user);
        }
      }

      if (conflictingParticipants.length == 0 && !userConflict) {
        return res.status(400).json({
          error: `The room ${conflict.map(
            (c) => c.room
          )} is already booked at the requested time.`,
        });
      } else if (conflictingParticipants.length > 0 && userConflict) {
        return res.status(400).json({
          error: `The User and the below participants are already booked at the requested time for a meeting in The room ${conflict.map(
            (c) => c.room
          )}`,
          conflictingParticipants,
        });
      } else if (conflictingParticipants.length > 0) {
        return res.status(400).json({
          error: `The below participants are already booked at the requested time for a meeting in The room ${conflict.map(
            (c) => c.room
          )}`,
          conflictingParticipants,
        });
      } else if (userConflict) {
        return res.status(400).json({
          error: `The User is already booked at the requested time for a meeting in The room ${conflict.map(
            (c) => c.room
          )}`,
          conflictingParticipants,
        });
      }
      return res.status(400).json({
        error: `The room ${conflict.map(
          (c) => c.room
        )} and below participants are already booked at the requested time.`,
        conflictingParticipants,
      });
    }

    // Create the meeting and add it to the participant's list of meetings
    const meeting = await Meeting.create({
      date,
      start_time,
      end_time,
      room,
      participants,
      user,
    });
    for (const participant of participants) {
      await User.findByIdAndUpdate(participant, {
        $push: { meetings: meeting._id },
      });
    }

    await User.findByIdAndUpdate(user, {
      $push: { meetings: meeting._id },
    });

    return res.status(201).json(meeting);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the meeting." });
  }
};

export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("participants")
      .populate("user");
    res.json(meetings);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the meetings." });
  }
};

export const getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate(
      "participants"
    );
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMeeting = async (req, res) => {
  try {
    let { date, start_time, end_time, room, participants } = req.body;
    // Get the existing meeting and its participants
    const meeting = await Meeting.findById(req.params.id);
    let user = meeting.user;
    start_time = `${date}T${start_time}:00Z`;
    end_time = `${date}T${end_time}:00Z`;
    const updatedParticipants = participants.map((p) => p.toString());

    // Check if the room is available at the requested date and time
    const conflict = await Meeting.find({
      $and: [
        {
          _id: { $ne: req.params.id },
          $or: [
            { room: room, date: date },
            { participants: { $in: participants }, date: date },
            { participants: user, date: date },
            { user: { $in: participants }, date: date },
            { user: user, date: date },
          ],
        },
        {
          $and: [
            {
              start_time: { $lte: start_time },
              end_time: { $gte: start_time },
            },
            {
              start_time: { $lte: end_time },
              end_time: { $gte: end_time },
            },
            {
              start_time: { $gte: start_time },
              end_time: { $lte: end_time },
            },
          ],
        },
      ],
    }).select("participants room date start_time end_time user");

    if (conflict.length > 0) {
      const conflictingParticipants = [];
      let userConflict = null;
      for (const c of conflict) {
        c.participants.forEach((p) => {
          if (updatedParticipants.includes(p.toString())) {
            conflictingParticipants.push(p);
          }
        });
        if (c.user == user || updatedParticipants.includes(c.user.toString())) {
          userConflict = true;
        }
      }

      if (conflictingParticipants.length == 0 && !userConflict) {
        return res.status(400).json({
          error: `The room ${conflict.map(
            (c) => c.room
          )} is already booked at the requested time.`,
        });
      } else if (conflictingParticipants.length > 0 && userConflict) {
        return res.status(400).json({
          error: `The User and the below participants are already booked at the requested time for a meeting in The room ${conflict.map(
            (c) => c.room
          )}`,
          conflictingParticipants,
        });
      } else if (conflictingParticipants.length > 0) {
        return res.status(400).json({
          error: `The below participants are already booked at the requested time for a meeting in The room ${conflict.map(
            (c) => c.room
          )}`,
          conflictingParticipants,
        });
      } else if (userConflict) {
        return res.status(400).json({
          error: `The User is already booked at the requested time for a meeting in The room ${conflict.map(
            (c) => c.room
          )}`,
          conflictingParticipants,
        });
      }
      return res.status(400).json({
        error: `The room ${conflict.map(
          (c) => c.room
        )} and below participants are already booked at the requested time.`,
        conflictingParticipants,
      });
    }

    // Concatenate the new participants with the existing participants list
    const allParticipants = [
      ...meeting.participants.map((p) => p.toString()),
      ...participants.map((p) => p.toString()),
    ];
    const uniqueParticipants = [...new Set(allParticipants)];

    // Update the meeting details and participants list
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        date,
        start_time,
        end_time,
        room,
        participants: uniqueParticipants,
      },
      { new: true }
    ).populate("participants");

    // Update the participants' meetings list
    for (const participant of updatedMeeting.participants) {
      await User.findByIdAndUpdate(participant._id, {
        $addToSet: { meetings: updatedMeeting._id },
      });
    }

    return res.status(200).json(updatedMeeting);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the meeting." });
  }
};

export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    const updatedParticipants = [];
    meeting.participants.forEach((p) => updatedParticipants.push(p.toString()));
    // const user = await User.findById(meeting.participant);
    const users = await User.find({ _id: { $in: updatedParticipants } });
    for (const user of users) {
      await user.meetings.pull(meeting._id);
      await user.save();
    }
    const meetingOrganiser = await User.findById(meeting.user.toString());
    await meetingOrganiser.meetings.pull(meeting._id);
    await meetingOrganiser.save();
    await Meeting.deleteOne({ _id: req.params.id });

    res.json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the meetings." });
  }
};
