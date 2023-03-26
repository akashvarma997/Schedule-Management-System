# Schedule-Management-System

This app is Built using the MERN stack, consisting of React for the frontend and Express, MongoDB, and Mongoose for the backend server. I have implemented 9 APIs that perform various operations such as creating, updating, and deleting meetings and users, as well as fetching information about meetings and users.
When creating a meeting, the API checks whether there are any existing meetings that may conflict with the new meeting's date, time, and room. The API also ensures that participants and user to be added to the new meeting do not have any meetings scheduled at the same date and time. I have used logical and comparison operators such as $or, $and, $gte, $lte to filter out conflicting meetings. If there are no conflicts, the API adds the new meeting. If there are conflicts, the API rejects the meeting and returns the specific error message indicating which meeting or participant conflicts with the new meeting's details and who is responsible for the conflict. The same process is followed when updating a meeting.

To delete a meeting, the API first removes the meeting from the participant's and user's list of meetings, then deletes the meeting itself. When deleting a user, the API checks which meetings the user is a participant in and removes the user from the participants' list in all those meetings. If the user is the organizer (i.e., the user is added to the user field of the meeting), the API deletes the meeting itself.

The frontend interface is simple and intuitive, allowing users to add different users, schedule a meeting at a particular date, time, and room, select the user creating the meeting, and choose the participants. Users can also update meetings and delete meetings and users.

Overall, the application provides a user-friendly interface and robust backend functionality that ensures scheduling meetings is error-free and efficient.
