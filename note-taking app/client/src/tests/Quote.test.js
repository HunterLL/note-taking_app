import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Quote from '../components/Quote';

jest.mock('axios');

test('renders Quote component with a random quote', async () => {
  const mockQuote = 'Mocked quote';
  const mockAuthor = 'Mocked author';

  axios.get.mockResolvedValue({
    data: {
      content: mockQuote,
      author: mockAuthor,
    },
  });

  render(<Quote />);

  await waitFor(() => {
    const quoteElement = screen.getByText(mockQuote);
    const authorElement = screen.getByText(mockAuthor);

    expect(quoteElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();
  });
});
