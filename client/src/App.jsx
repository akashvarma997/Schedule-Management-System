import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import MeetingUpdate from "./components/MeetingUpdate";
import config from './config';

function App() {
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [participants, setParticipant] = useState([]);
  const [user, setUser] = useState("");

  async function fetchMeetings() {
    const response = await axios.get(`${config.apiUrl}/meeting`);
    setMeetings(response.data);
  }

  async function fetchUsers() {
    const response = await axios.get(`${config.apiUrl}/user`);
    setUsers(response.data);
  }
  useEffect(() => {
    fetchMeetings();
    fetchUsers();
  }, [meetings]);

  async function handleMeetingSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post(`${config.apiUrl}/meeting`, {
        date,
        start_time,
        end_time,
        room,
        participants,
        user,
      });

      fetchMeetings();
      // setMeetings([...meetings, response.data]);
      // fetchUsers();
    } catch (error) {
      alert("There is a conflict between the user,participants,date,time or room");
    }
  }

  async function handleMeetingDelete(id) {
    try {
      await axios.delete(`${config.apiUrl}/meeting/${id}`);

      setMeetings(meetings.filter((meeting) => meeting._id !== id));
    } catch (error) {
      alert(error.response.data);
    }
  }

  async function handleUserSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post(`${config.apiUrl}/user`, {
        name,
        email,
        password,
      });

      setUsers([...users, response.data]);
    } catch (error) {
      alert(error.response.data);
    }
  }

  async function handleUserDelete(id) {
    try {
      await axios.delete(`${config.apiUrl}/user/${id}`);

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="container">
      <div className="Meetings">
        <h2 style={{ paddingBottom: "20px" }}>Meetings</h2>
        <div>
          <form className="meetingsForm" onSubmit={handleMeetingSubmit}>
            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <label>
              Start time:
              <input
                type="time"
                value={start_time}
                onChange={(event) => setStartTime(event.target.value)}
                required
              />
            </label>
            <label>
              End time:
              <input
                type="time"
                value={end_time}
                onChange={(event) => setEndTime(event.target.value)}
                required
              />
            </label>
            <label>
              Room:
              <select
                value={room}
                onChange={(event) => setRoom(event.target.value)}
                required
              >
                <option value="">Select room</option>
                <option value="r1">Room 1</option>
                <option value="r2">Room 2</option>
                <option value="r3">Room 3</option>
                <option value="r4">Room 4</option>
                <option value="r5">Room 5</option>
              </select>
            </label>
            <label>
              User:
              <select
                value={user}
                onChange={(event) => setUser(event.target.value)}
                required
              >
                <option value="">Organiser</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Participants:
              <div
                style={{ overflowY: "scroll", height: "100px", width: "200px" }}
              >
                {users.map((user) => (
                  <div key={user._id}>
                    <input
                      type="checkbox"
                      id={user._id}
                      value={user._id}
                      checked={participants.includes(user._id)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setParticipant([...participants, event.target.value]);
                        } else {
                          setParticipant(
                            participants.filter(
                              (id) => id !== event.target.value
                            )
                          );
                        }
                      }}
                    />
                    <label htmlFor={user._id}>{user.name}</label>
                  </div>
                ))}
              </div>
            </label>
            <button style={{ width: "fit-content" }} type="submit">
              Schedule meeting
            </button>
          </form>
        </div>

        <div>
          <ul className="meetingsList">
            {meetings.map((meeting) => {
              return (
                <li key={meeting._id}>
                  {`${
                    meeting.user.name
                  } has scheduled Meeting with ${meeting.participants
                    .map((p) => p.name)
                    .join(", ")} on ${meeting.date.slice(
                    0,
                    10
                  )} from ${meeting.start_time.slice(
                    11,
                    16
                  )} to ${meeting.end_time.slice(11, 16)} in room ${
                    meeting.room
                  }`}
                  <button
                    type="button"
                    onClick={() => handleMeetingDelete(meeting._id)}
                  >
                    Delete
                  </button>
                  <MeetingUpdate meeting={meeting} users={users}/>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="users">
        <h2 style={{ paddingBottom: "20px" }}>Users</h2>
        <div className="userForm">
          <form className="meetingsForm" onSubmit={handleUserSubmit}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button type="submit">Add user</button>
          </form>
        </div>
        <div style={{overflowY:"scroll", height:"200px"}}>
          <ul className="usersList">
            {users.map((user) => (
              <li key={user._id}>
                <span style={{ paddingRight: "10px" }}>{user.name}</span>
                <span>{user.email}</span>
                <button
                  type="button"
                  onClick={() => handleUserDelete(user._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
