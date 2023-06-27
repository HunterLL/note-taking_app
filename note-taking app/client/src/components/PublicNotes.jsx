import React, { useEffect, useState } from 'react';

const PublicNotes = () => {
  const [publicNotes, setPublicNotes] = useState([]);

  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/notes/public`);
        const data = await response.json();

        // Fetch user information for each note
        const notesWithAuthor = await Promise.all(
          data.map(async (note) => {
            const userResponse = await fetch(`http://localhost:8000/notes/user/${note.id}`);
            const userData = await userResponse.json();
            const author = userData.username;

            // Format creation date as "Jun 23 2023"
            const creationDate = new Date(note.createdAt);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            const formattedCreationDate = creationDate.toLocaleString('en-US', options);

            return { ...note, author, formattedCreationDate};
          })
        );
        // Sort the notes by creation date in descending order
        const sortedNotes = notesWithAuthor.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setPublicNotes(sortedNotes);
      } catch (error) {
        console.error('Error fetching public notes:', error);
      }
    };

    fetchPublicNotes();

    // Fetch public notes every 2 seconds
    const interval = setInterval(fetchPublicNotes, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h2>Latest Public Notes</h2>
      <div className='public-notes'>
        {publicNotes.map((note) => (
          <div key={note.id} className='individual-note'>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <br/>
            <p>
              Author: {note.author} · Created on: {note.formattedCreationDate} 
            </p>
          </div>
        ))}
      </div>
    </>
    
  );
};

export default PublicNotes;
