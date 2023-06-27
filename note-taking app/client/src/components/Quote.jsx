import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.quotable.io/random');
        const data = response.data;
        setQuote(data.content);
        setAuthor(data.author)
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className='quote'>
      <h2>Quote of the Day:</h2>
      <p>{quote}</p>
      <p>{author}</p>
    </div>
  );
};

export default Quote;
