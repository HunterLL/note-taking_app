import React, { useState, useEffect } from 'react';
import { useAuthToken } from "../AuthTokenContext";
import axios from 'axios';

const NoteCounter = ({onNoteAdded}) => {
  const { accessToken } = useAuthToken();
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    fetchNoteCount();
  }, [onNoteAdded]);

  const fetchNoteCount = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const notes = response.data;
      const count = notes.length;
      setNoteCount(count);
    } catch (error) {
      console.error('Error fetching note count:', error);
    }
  };

  return (
    <div className='note-counter-container'>
      <span className='note-counter'>😀 Wow! You have created <span>{noteCount}</span> notes so far.</span>
    </div>
  )
};

export default NoteCounter;
