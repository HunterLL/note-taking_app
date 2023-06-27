import React from 'react';
import FormattedDate from './FormattedDate';
import "../style/index.css"

const NotesList = ({ notes, onNoteClick }) => {
    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) {
          return content;
        }
        return content.substring(0, maxLength) + '...';
    };
    

    return (
        <>
        <h2>Notes</h2>
        <div className='all-notes-container'>
            {notes.map((note) => (
            <div key={note.id} className='each-note'>
                <h3>{note.title}</h3>
                { note.privacyLevel === 'PRIVATE' && <p className='private'>🔒</p> }
                <p role="paragraph">{truncateContent(note.content, 50)}</p>
                <p className='timestamp'>Created: <FormattedDate timestamp={note.createdAt} /></p>
                <button className='view-details button' onClick={() => onNoteClick(note)}>View Details</button>
            </div>
            ))}
        </div>
        </>   
    );
};

export default NotesList;
