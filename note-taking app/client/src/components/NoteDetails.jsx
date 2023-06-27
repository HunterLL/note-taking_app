import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthToken } from "../AuthTokenContext";
import YouTubeInspiration from './YouTubeInspiration';
import "../style/index.css"


function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();
  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: '',
    content: '',
    privacyLevel: 'public',
  });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/notes/${id}`, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const fetchedNote = await response.json();
          setNote(fetchedNote);
          setEditedNote(fetchedNote);
        } else {
          console.log('Failed to fetch note:', response.status);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };

    fetchNote();
  }, [id, accessToken]);

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedNote(note);
  };

  const handleEditNote = () => {
    setEditMode(true);
  };

  const handleTitleChange = (e) => {
    setEditedNote({
      ...editedNote,
      title: e.target.value,
    });
  };

  const handleContentChange = (e) => {
    setEditedNote({
      ...editedNote,
      content: e.target.value,
    });
  };

  const handlePrivacyLevelChange = (e) => {
    setEditedNote({
      ...editedNote,
      privacyLevel: e.target.value,
    });
  };

  const handleSaveNote = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedNote),
      });

      if (response.ok) {
        setNote(editedNote);
        setEditMode(false);
      } else {
        console.log('Failed to save note:', response.status);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        navigate('/app/notes');
      } else {
        console.log('Failed to delete note:', response.status);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };


  return (
    <div>
      <h2>Note Details</h2>
      {note && !editMode && (
        <div className='edit-note-detail off-mode'>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <p>Privacy Level: {note.privacyLevel}</p>
          <button className='edit-note button' onClick={handleEditNote}>Edit</button>
          <button className='delete-note button' onClick={handleDeleteNote}>Delete</button>
        </div>
      )}
      {note && editMode && (
        <div className='edit-note-detail on-mode'>
          <input type="text" value={editedNote.title} onChange={handleTitleChange} />
          <textarea value={editedNote.content} onChange={handleContentChange} />
          <select value={editedNote.privacyLevel} onChange={handlePrivacyLevelChange}>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
          <button className='save-note button' onClick={handleSaveNote}>Save</button>
          <button className='cancel-note button' onClick={handleCancelEdit}>Cancel</button>
        </div>
      )}
      <YouTubeInspiration />
    </div>
  );
}

export default NoteDetails;