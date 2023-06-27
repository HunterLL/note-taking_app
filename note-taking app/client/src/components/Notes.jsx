
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import NotesList from './NotesList';
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/index.css"

const Notes = () => {
  const { isAuthenticated} = useAuth0();
  const { accessToken } = useAuthToken();
  const location = useLocation();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
      fetchNotes();
  });

  useEffect(() => {
    // Update the URL when a note is selected
    if (selectedNote) {
      const url = `/app/notes/${selectedNote.id}`;
      if (location.pathname !== url) {
        navigate(url);
      }
    }
  }, [selectedNote, location, navigate]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (response.ok) {
      const fetchedNotes = await response.json();
      setNotes(fetchedNotes);
    } else {
      console.log("Failed to fetch notes:", response.status);
    }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    navigate(`/app/notes/${note.id}`);
  };

  return (
    <div>
      {!isAuthenticated ? (<h2>No notes</h2> ): (
      <NotesList notes={notes} onNoteClick={handleNoteClick} />
      )}
    </div>
  );
};

export default Notes;
