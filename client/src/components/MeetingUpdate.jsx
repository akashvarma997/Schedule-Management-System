import React, { useState } from "react";
import "../App.css";
import config from "../config";

const MeetingUpdate = ({ meeting, users}) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedMeeting, setUpdatedMeeting] = useState({
    date: meeting.date.slice(0, 10),
    start_time: meeting.start_time.slice(11, 16),
    end_time: meeting.end_time.slice(11, 16),
    participants: meeting.participants.map((p) => p._id),
    room: meeting.room,
  });

  const handleMeetingUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/meeting/${meeting._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMeeting),
      });
      if (response.ok) {
        setShowUpdateForm(false);
      } else {
        alert(
          "There is a conflict between the user,participants,date,time or room"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setShowUpdateForm(!showUpdateForm)}>
        {showUpdateForm ? "Cancel" : "Update"}
      </button>
      <div
        style={{
          display: showUpdateForm?"flex":"none",
          flexDirection: "column",
          padding: "10px",
          position: "absolute",
          top: "5px",
          right: "40%",
          backgroundColor:"white"
        }}
        className="updateModal"
      >
        {showUpdateForm && (
          <form
            style={{ border: "5px solid black" }}
            onSubmit={handleMeetingUpdate}
          >
            <div className="modalItems">
              <label>
                Date:
                <input
                  type="date"
                  value={updatedMeeting.date}
                  onChange={(e) =>
                    setUpdatedMeeting({
                      ...updatedMeeting,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>
            <div className="modalItems">
              <label>
                Start Time:
                <input
                  type="time"
                  value={updatedMeeting.start_time}
                  onChange={(e) =>
                    setUpdatedMeeting({
                      ...updatedMeeting,
                      start_time: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  value={updatedMeeting.end_time}
                  onChange={(e) =>
                    setUpdatedMeeting({
                      ...updatedMeeting,
                      end_time: e.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>
            <div className="modalItems">
              <label>
                Room:
                <select
                  value={updatedMeeting.room}
                  onChange={(e) =>
                    setUpdatedMeeting({
                      ...updatedMeeting,
                      room: e.target.value,
                    })
                  }
                  required
                >
                  <option value="r1">Room 1</option>
                  <option value="r2">Room 2</option>
                  <option value="r3">Room 3</option>
                  <option value="r4">Room 4</option>
                  <option value="r5">Room 5</option>
                </select>
              </label>
            </div>
            <div className="modalItems">
              <label>
                Participants:
                <div
                  style={{
                    overflowY: "scroll",
                    height: "100px",
                    width: "200px",
                  }}
                >
                  {users.map((user) => (
                    <div key={user._id}>
                      <input
                        type="checkbox"
                        value={user._id}
                        checked={updatedMeeting.participants.includes(user._id)}
                        onChange={(e) =>
                          setUpdatedMeeting({
                            ...updatedMeeting,
                            participants: e.target.checked
                              ? [...updatedMeeting.participants, user._id]
                              : updatedMeeting.participants.filter(
                                  (p) => p !== user._id
                                ),
                          })
                        }
                      />
                      {user.name}
                    </div>
                  ))}
                </div>
              </label>
              <div style={{ margin: 10 }}>
                <button type="submit">Update Meeting</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default MeetingUpdate;
