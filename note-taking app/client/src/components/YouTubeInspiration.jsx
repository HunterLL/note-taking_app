import React, { useState} from 'react';
import axios from 'axios';

const YouTubeInspiration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [youTubeVideos, setYouTubeVideos] = useState([]);

  // Function to handle the search bar input change
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchVideos = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
            key: 'AIzaSyAFG_ZipxrU3u_PEWRr2KO4GIYX3Q1IaHw',
          q: `${searchTerm}`,
          part: 'snippet',
          maxResults: 3
        }
      });

      const videos = response.data.items;
      setYouTubeVideos(videos);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };  
  

  return (
    <div className="youtube-api-container">
      <h2>Get Inspiration from YouTube</h2>
      <div>
          <input type="text" value={searchTerm} onChange={handleInputChange} placeholder="Search videos" />
          <button className='search button' onClick={searchVideos}>Search</button>
      </div>
          {youTubeVideos.map((video) => (
            <div key={video.id.videoId}>
              <h3>{video.snippet.title}</h3>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
    </div>
  );
};

export default YouTubeInspiration;
