import React, {useState} from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";
import NoteCounter from "./NoteCounter";

function NewNote() {
  const { accessToken } = useAuthToken();
  const { loginWithRedirect  } = useAuth0();
  const [noteAdded, setNoteAdded] = useState(false);
  const { isAuthenticated} = useAuth0();

  const handleNoteAdded = () => {
    setNoteAdded(!noteAdded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (accessToken) {
      try {
        const title = e.target.title.value;
        const content = e.target.content.value;
        const response = await fetch(`${process.env.REACT_APP_API_URL}/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
          const data = await response.json();
          e.target.reset();
          console.log("New note added:", data);
          handleNoteAdded();
        } else {
          throw new Error("Failed to add a new note");
        }
      } catch (error){
        console.error("Failed to add a new note:", error);
      }
    } else {
      //e.target.reset();
      loginWithRedirect();
    }
  };

  return (
    <>
      {isAuthenticated && <NoteCounter onNoteAdded={handleNoteAdded} />}
      <div className="note-form-wrapper">
        <h2>Create Your Own Note</h2>
        <form className="note-form" autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title: </label>
            <input type="text" name="title" id="title" required />
          </div>
          <br />
          <div>
            <label htmlFor="content">Content: </label>
            <textarea id="content" name="content" rows="5" required></textarea>
          </div>
          <br />
          <div className="submit-button-wrapper">
            <input type="submit" value="Add" />
          </div>
        </form>
      </div>
    </>
  );
}

export default NewNote;
