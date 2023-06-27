import NotesList from '../components/NotesList';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('NotesList', () => {
    const mockNotes = [
        { id: 1, title: 'Note 1', content: 'Content 1', createdAt: "2023-06-22T04:29:13.965Z" },
        { id: 2, title: 'Note 2', content: 'Content 2', createdAt: "2023-06-25T03:25:59.843Z" },
    ];

    const mockOnNoteClick = jest.fn();

    beforeEach(() => {
        render(<NotesList notes={mockNotes} onNoteClick={mockOnNoteClick} />);
    });

    test('renders the notes list', () => {
        const noteElements = screen.getAllByRole('heading', { level: 3 });
        expect(noteElements).toHaveLength(mockNotes.length);
    });

    test('renders the note title and truncated content', () => {
        const titleElements = screen.getAllByRole('heading', { level: 3 });
        const contentElements = screen.getAllByRole('paragraph');
    
        expect(titleElements).toHaveLength(mockNotes.length);
        expect(contentElements).toHaveLength(mockNotes.length);
        expect(contentElements[0].textContent).toContain('Content 1');
        expect(contentElements[1].textContent).toContain('Content 2');
    });

    test('renders the formatted creation date', () => {
        const dateElements = screen.getAllByText(/Created:/);
        expect(dateElements).toHaveLength(mockNotes.length);
        
        dateElements.forEach((dateElement, index) => {
            const creationDate = new Date(mockNotes[index].createdAt);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            const formattedCreationDate = creationDate.toLocaleString('en-US', options);
            const expectedDate = formattedCreationDate;
            expect(dateElement.textContent).toMatch(`Created: ${expectedDate}`);
        });
    });

    test('calls the onNoteClick function when the "View Details" button is clicked', () => {
        const viewDetailsButtons = screen.getAllByRole('button', { name: 'View Details' });
        expect(viewDetailsButtons).toHaveLength(mockNotes.length);

        viewDetailsButtons.forEach((button, index) => {
        button.click();
        expect(mockOnNoteClick).toHaveBeenCalledTimes(index + 1);
        expect(mockOnNoteClick).toHaveBeenCalledWith(mockNotes[index]);
        });
    });
});