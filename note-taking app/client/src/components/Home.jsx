
import React from 'react';
import PublicNotes from './PublicNotes';
import Quote from './Quote';
import NewNote from './NewNote'
import NoteCounter from "./NoteCounter";
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
    const { isAuthenticated } = useAuth0();

    return (
    <div>
        {isAuthenticated &&<NoteCounter />}
        <NewNote />
        <PublicNotes />
        <Quote />
    </div>
    
    );
}

export default Home;